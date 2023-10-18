import {UsersRepository} from "../../models/repositories/Users.repository";
import bcrypt from "bcrypt";
import {UsersRecord} from "../../models/users.record";
import jwt, {JwtPayload} from "jsonwebtoken";
import {JwtAccessTokenDuration, JwtRefreshTokenDuration, NewUser, RequestBody} from "../../types";
import {Request, Response} from "express";

export function _convertRolesToProperFormat(req: Request): string[] | null {
    const roles: string[] = req.body.roles ?? [];
    if (!Array.isArray(roles)) {
        return null;
    }
    return Array.from(new Set(roles.map(role => role.toLowerCase())));
}

export function checkUserNamePassword(req: Request, res: Response, username: string, password: string): boolean {
    if (!username || !password) {
        res.status(400).json({
            message: 'Bad input',
            response: 400,
        });
        return true;
    }
    return false;
}

export function checkRolesProvided(req: Request, res: Response): boolean {
    const roles = _convertRolesToProperFormat(req);
    const validRoles = new Set(['user', 'admin', 'api']);

    if (!roles?.every?.(role => validRoles.has(role))) {
        res.status(400).json({
            message: 'Bad input in roles',
            response: 400,
        });
        return true;
    }
    return false;
}

export async function checkIfUserExists(req: Request, res: Response, username: string, desiredNumber: number): Promise<boolean> {
    const findUser = await UsersRepository.findUserByUsername(username)

    if (findUser === 0) {
        res.status(400).json({
            message: 'Bad input',
            response: 400,
        });
        return true;
    }

    if (findUser !== desiredNumber) {
        res.status(409).json({
            "message": "Conflict",
            "response": 409
        });
        return true;
    }
    return false;
}

export async function checkPassword(req: Request, res: Response, username: string, passwordProvided: string): Promise<boolean> {
    const {password: passwordInDatabase} = await UsersRepository.getPasswordFromDatabase(username)

    const match = await bcrypt.compare(passwordProvided, passwordInDatabase);

    if (!match) {
        res.status(401).json({
            "message": "Unauthorized.",
            "response": 401
        });
        return false;
    } else {
        return true;
    }
}

export async function getRolesFromDatabase(username: string): Promise<string[]> {
    return UsersRepository.getRolesFromDatabase(username);

}

export async function createNewUser(req: Request, res: Response) {
    const {username, password}: RequestBody = req.body;
    const roles = _convertRolesToProperFormat(req);

    try {
        // password encryption
        const hashedPass = await bcrypt.hash(String(password), 10);
        const newUser: NewUser = {
            id: undefined,
            "username": username.toLowerCase(),
            "roles": roles,
            "refreshToken": null,
            "password": hashedPass
        }

        const {id, rolesNumber} = await UsersRepository.addUser(new UsersRecord(newUser));

        res.status(201).json({
            "message": "Success! User created!",
            "response": 201,
            "id": id,
            "User": username,
            "roles": roles
        })
    } catch (err) {
        res.status(500).json({"message": `${err.message}`}); // 500 - Internal Server Error
    }
}

export function createAccessToken(res: Response, username: string, roles: string[], expiresIn: JwtAccessTokenDuration) {
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": username,
                "roles": roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn: expiresIn}
    )

    // @TODO: new 19.06.2023 - creating access
    if (username !== 'Api') {
        res.cookie('jwt_a', accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })
    }

    return {accessToken};
}

export async function createRefreshToken(res: Response, username: string, accessToken: {
    accessToken: string
}, expiresIn: JwtRefreshTokenDuration) {
    const refreshToken = jwt.sign(
        {"username": username},
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: expiresIn
        }
    );
    await UsersRepository.addRefreshToken(username, refreshToken);

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    })

    if (username === 'Api') {
        res.json(accessToken);
    }


}

export async function getRefreshToken(username: string): Promise<UsersRecord> {
    return await UsersRepository.getRefreshTokenFromDatabase(username);
}

export async function evaluateJWT(res: Response, refreshToken: string, username: string) {
    const roles = await getRolesFromDatabase(username)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            const decodedPayload = decoded as JwtPayload;

            if (err || username !== decodedPayload.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decodedPayload.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );
            res.json({accessToken})
        });
}

export function goToHomePage(res: Response) {
    res.render('home/index')
}