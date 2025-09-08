import { GetStatusesCriteria } from "../../../../statuses/application/get-statuses/get-statuses-criteria";
import { StatusRepository } from "../../../../statuses/domain/repositories/status-repository";
import { Status } from "../../../../statuses/domain/status";
import { StatusId } from "../../../../statuses/domain/value-objects/status-id/status-id";
import { StatusName } from "../../../../statuses/domain/value-objects/status-name/status-name";
import { Connection, RowDataPacket } from 'mysql2/promise';

export class MySqlStatusRepository implements StatusRepository {

    private _connection: Connection;

    constructor(connection: Connection) {
        this._connection = connection;
    }

    async create(status: Status): Promise<void> {
        await this._connection.execute(`
            INSERT INTO statuses (status_id, name)
            VALUES (?, ?);`,
            [status.id().value(), status.name().value()]);
    }

    async findById(statusId: StatusId): Promise<Status | null> {
        const [rows] = await this._connection.execute<RowDataPacket[]>(`
            SELECT status_id, name
            FROM statuses
            WHERE status_id = ?
            LIMIT 1;`,
            [statusId.value()]);

        if (rows.length === 0) {
            return null;
        }

        return new Status(new StatusId(rows[0].status_id), new StatusName(rows[0].name));
    }

    async findByName(statusName: StatusName): Promise<Status | null> {
        const [rows] = await this._connection.execute<RowDataPacket[]>(`
            SELECT status_id, name
            FROM statuses
            WHERE name = ?
            LIMIT 1;`,
            [statusName.value()]);

        if (rows.length === 0) {
            return null;
        }

        return new Status(new StatusId(rows[0].status_id), new StatusName(rows[0].name));
    }

    async remove(statusId: StatusId): Promise<void> {
        await this._connection.execute(`
            DELETE FROM statuses
            WHERE status_id = ?
            LIMIT 1;`,
            [statusId.value()]);
    }

    async getByFilters(criteria: GetStatusesCriteria): Promise<Status[]> {
        let query: string = `
        SELECT status_id, name
        FROM statuses`;

        let params: string[] = [];

        if (criteria.name) {
            query += `
            WHERE name LIKE ?`;
            params.push(`%${criteria.name.value()}%`);
        }

        query += ` ORDER BY created_at ASC, status_id ASC;`;

        const [rows] = await this._connection.execute<RowDataPacket[]>(query, params);

        if (rows.length === 0) {
            return [];
        }

        let statuses: Status[] = [];

        for (const element of rows) {
            statuses.push(new Status(new StatusId(element.status_id), new StatusName(element.name)));
        }

        return statuses;
    }

}