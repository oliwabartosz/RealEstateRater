import {Request, Response, NextFunction} from "express";

export class ValidationError extends Error {}
export class NotFoundError extends Error {}

//@TODO: make handleError for API and front-end
export function handleError(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof NotFoundError) {
        res
            .status(404)
            .render('error', {
                message: "Can't find id", // @TODO: ????
            });
        return;
    }

    console.error(err);

    res.status(err instanceof ValidationError ? 400 : 500);

    res.render('error', {
        message: err instanceof ValidationError ? err.message : "Something went wrong, please try again.",
    });

}
