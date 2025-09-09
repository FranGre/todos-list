import { Connection, RowDataPacket } from 'mysql2/promise';
import { StatusId } from "../../../../statuses/domain/value-objects/status-id/status-id";
import { GetTasksCriteria } from "../../../../tasks/domain/criteria/get-tasks-criteria";
import { TaskRepository } from "../../../../tasks/domain/repositories/task-repository";
import { Task } from "../../../../tasks/domain/task";
import { TaskId } from "../../../../tasks/domain/value-objects/task-id/task-id";
import { TaskTitle } from '../../../../tasks/domain/value-objects/task-title/task-title';

export class MySqlTaskRepository implements TaskRepository {

    private _connection: Connection;

    constructor(connection: Connection) {
        this._connection = connection;
    }

    async create(task: Task): Promise<void> {
        await this._connection.execute(`
            INSERT INTO tasks (task_id, status_id, title)
            VALUES (?, ?, ?);`,
            [task.id().value(), task.statusId().value(), task.title().value()]);
    }

    async findById(taskId: TaskId): Promise<Task | null> {
        const [rows] = await this._connection.execute<RowDataPacket[]>(`
                    SELECT task_id, status_id, title
                    FROM tasks
                    WHERE task_id = ?
                    LIMIT 1;`,
            [taskId.value()]);

        if (rows.length === 0) {
            return null;
        }

        return new Task(new TaskId(rows[0].task_id), new StatusId(rows[0].status_id), new TaskTitle(rows[0].title));
    }

    async remove(taskId: TaskId): Promise<void> {
        await this._connection.execute(`
            DELETE FROM tasks
            WHERE task_id = ?
            LIMIT 1;`,
            [taskId.value()]);
    }

    async update(task: Task): Promise<void> {
        await this._connection.execute(`
            UPDATE tasks 
            SET
                status_id = ?,
                title = ?
            WHERE task_id = ?;`, [task.statusId().value(), task.title().value(), task.id().value()]);
    }

    async getByStatusId(statusId: StatusId): Promise<Task[]> {
        const [rows] = await this._connection.execute<RowDataPacket[]>(`
                    SELECT task_id, status_id, title
                    FROM tasks
                    WHERE status_id = ?;`,
            [statusId.value()]);

        let tasks: Task[] = [];

        if (rows.length === 0) {
            return tasks;
        }

        for (const element of rows) {
            tasks.push(
                new Task(new TaskId(element.task_id), new StatusId(element.status_id), new TaskTitle(element.title))
            );
        }

        return tasks;
    }

    async getByFilters(criteria: GetTasksCriteria): Promise<Task[]> {
        let query: string = `
        SELECT task_id, status_id, title
        FROM tasks`;

        let params: string[] = [];
        let conditions: string[] = [];

        if (criteria.statusId) {
            conditions.push('status_id = ?');
            params.push(criteria.statusId.value());
        }

        if (criteria.title) {
            conditions.push('title LIKE ?');
            params.push(`%${criteria.title.value()}%`);
        }

        if (conditions.length >= 1) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` ORDER BY created_at ASC;`;

        const [rows] = await this._connection.execute<RowDataPacket[]>(query, params);

        let tasks: Task[] = [];

        if (rows.length === 0) {
            return tasks;
        }

        for (const element of rows) {
            tasks.push(
                new Task(new TaskId(element.task_id), new StatusId(element.status_id), new TaskTitle(element.title))
            );
        }

        return tasks;
    }

}