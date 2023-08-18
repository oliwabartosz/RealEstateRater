import {pool} from "../config/dbConn";
import {ValidationError} from "../config/error";


export class UsersRecord {
    public id: string;
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
        this.validate();
    }

    private validate() {
        if (this.username.length < 3 || this.username.length > 25) {
            throw new ValidationError('Nazwa użytkownika powinna zawierać od 3 do 25 znaków');
        }

        //@TODO: more validation for password etc.

    }


}
