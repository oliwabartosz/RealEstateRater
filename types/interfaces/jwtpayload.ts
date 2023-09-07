import {JwtPayload} from "jsonwebtoken";

export interface JwtPayloadCustom extends JwtPayload  {
    UserInfo: {
        username: string;
        roles: string[];
    };
}