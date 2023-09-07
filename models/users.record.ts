import {pool} from "../config/dbConn";
import {ValidationError} from "../config/error";
import {NewUser} from "../types";


export class UsersRecord {
    public id: string | undefined;
    readonly username: string;
    readonly password: string;
    readonly refreshToken: string;
    readonly roles: string[];

    constructor(obj: UsersRecord) {
        this.id = obj.id;
        this.username = obj.username;
        this.password = obj.password;
        this.refreshToken = obj.refreshToken;
        this.roles = obj.roles;
    }

}
