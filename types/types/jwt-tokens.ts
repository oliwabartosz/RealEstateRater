export type JwtAccessTokenDuration = "15m" | "1h" | "1d";
export type JwtRefreshTokenDuration = "1d" | "7d" | "30d";

export type JwtAccessToken = {
    expiresIn: JwtAccessTokenDuration;
};

export type JwtRefreshToken = {
    expiresIn: JwtRefreshTokenDuration;
};