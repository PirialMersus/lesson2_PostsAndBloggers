import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import {bloggers} from "./repositories/db";
import {bloggersRepository} from "./repositories/bloggers-repository";
import {postsRepository} from "./repositories/posts-repository";
import {bloggersRouter} from "./routes/bloggers-routes";
import {postsRouter} from "./routes/posts-routes";
import {authMiddleware} from "./middlewares/auth-middleware";

const ipAddressesBlackList = ['192.160.1.1', '::2'];

const blackListMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const result = ipAddressesBlackList.find((el: string) => el === ip)
    if (result) {
        res.sendStatus(403)
        return
    }
    next()
}

let count = 0
const countMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    count++
    res.header('count', count.toString())
    next()
}

export const contentTypeMiddleWare = (contentType: string) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.is(contentType)) {
        res.sendStatus(400).send('Bad content type');
    }
    next()
}

const app = express();
app.use(cors());
// app.use(contentTypeMiddleWare);
// app.use(blackListMiddleWare);
// app.use(countMiddleWare);
app.use(authMiddleware)
app.use(bodyParser.json());



const port = process.env.PORT || 5000;


interface IErrorMessage {
    data: {
        additionalProp1: string,
        additionalProp2: string,
        additionalProp3: string
    },
    errorsMessages: [
        {
            message: string,
            field: string
        }
    ],
    resultCode: number
}

export const errorObj: IErrorMessage = {
    data: {
        additionalProp1: '',
        additionalProp2: '',
        additionalProp3: '',
    },
    errorsMessages: [{
        message: '',
        field: ''
    }],
    resultCode: 0
}


app.get('/', (req: Request, res: Response) => {
    res.send('Hello: World');
})

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

