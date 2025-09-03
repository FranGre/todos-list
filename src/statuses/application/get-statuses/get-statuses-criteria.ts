import { StatusName } from "../../../statuses/domain/value-objects/status-name/status-name";

export class GetStatusesCriteria {

    constructor(public readonly name?: StatusName) { }

}