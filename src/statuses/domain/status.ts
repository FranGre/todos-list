import { StatusId } from "./value-objects/status-id/status-id";
import { StatusName } from "./value-objects/status-name/status-name";

export class Status {

    constructor(private _id: StatusId, private _name: StatusName) {}

    id(): StatusId {
        return this._id;
    }

    name(): StatusName {
        return this._name;
    }

}