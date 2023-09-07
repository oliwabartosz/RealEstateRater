import {UsersRecord} from "../../models/users.record";

export interface NewUser {
    id: undefined;
    username: string;
    roles: string[];
    refreshToken: null | string;
    password: string;

}