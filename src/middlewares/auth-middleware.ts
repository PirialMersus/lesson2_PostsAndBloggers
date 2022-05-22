import {NextFunction, Request, Response} from "express";

// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     if (req.query.token === '123') {
//         next()
//     } else {
//         res.sendStatus(401)
//     }
// }
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
        const [username, password] = credentials.split(':');
        if (username === 'admin' && password === 'qwerty') {
            next()
        } else {
            res.sendStatus(401)
        }
        return
    }
    next()
}