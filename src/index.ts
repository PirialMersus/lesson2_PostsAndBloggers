import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import {blogs, posts} from "./repositories/db";
import {blogsRepository} from "./repositories/blogs-repository";
import {postsRepository} from "./repositories/posts-repository";
import {blogsRouter} from "./routes/blogs-routes";
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
app.use(bodyParser.json());


const port = process.env.PORT || 5000;


interface IErrorMessage {
    errorsMessages: [
        {
            message: string,
            field: string
        }
    ],
}

export const errorObj: IErrorMessage = {
    errorsMessages: [{
        message: '',
        field: ''
    }],
}


app.get('/', (req: Request, res: Response) => {
    res.send('Hello: World');
})

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.delete('/testing/all-data', (req: Request, res: Response) => {
    blogs.length = 0
    posts.length = 0
    res.send(204)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

