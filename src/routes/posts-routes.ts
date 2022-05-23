import {Request, Response, Router} from 'express'
import {contentTypeMiddleWare, errorObj} from "../index";
import {bloggers} from "../repositories/db";
import {postsRepository} from "../repositories/posts-repository";
import {body, param} from 'express-validator';
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";

// put here array with videos
export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
    const posts = postsRepository.getPosts()
    res.send(posts);
})
    .get('/:postId', (req: Request, res: Response) => {

        const id = +req.params.postId;

        const post = postsRepository.getPostsById(id)

        if (post) {
            res.send(post)
        } else {
            res.send(404)
        }
    })
    .post('/',
        // contentTypeMiddleWare('application/json'),
        body('title').trim().not().isEmpty().withMessage('enter input value in title field'),
        body('shortDescription').trim().not().isEmpty().withMessage('enter input value in shortDescription field'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('bloggerId').trim().not().isEmpty().withMessage('enter input value in bloggerId field'),
        body('title').isLength({max: 30}).withMessage('title length should be less then 30'),
        body('content').isLength({max: 1000}).withMessage('content length should be less then 1000'),
        body('shortDescription').isLength({max: 100}).withMessage('shortDescription length should be less then 100'),
        body('bloggerId').isLength({max: 1000}).withMessage('bloggerId length should be less then 1000'),
        inputValidatorMiddleware,
        // authMiddleware,
        (req: Request, res: Response) => {
            const newPost = postsRepository.createPost(req.body.title,
                req.body.shortDescription,
                req.body.content,
                +req.body.bloggerId)

            if (!newPost) {
                errorObj.errorsMessages = [{
                    message: 'incorrect blogger id',
                    field: 'bloggerId',
                }]
                res.status(400).send(errorObj)
            }

            res.status(201).send(newPost)

        })
    .put('/:id?',
        body('bloggerId').custom((value, {req}) => {
            if (!bloggers.find(blogger => blogger.id === +value)) {
                throw new Error('incorrect blogger id');
            }
            // Indicates the success of this synchronous custom validator
            return true;
        }),
        body('bloggerId').trim().not().isEmpty().withMessage('enter input value in bloggerId field'),
        body('title').trim().not().isEmpty().withMessage('enter input value in title field'),
        body('shortDescription').trim().not().isEmpty().withMessage('enter input value in shortDescription field'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('title').isLength({max: 30}).withMessage('title length should be less then 30'),
        body('content').isLength({max: 1000}).withMessage('content length should be less then 1000'),
        body('shortDescription').isLength({max: 100}).withMessage('shortDescription length should be less then 100'),
        body('bloggerId').isLength({max: 1000}).withMessage('bloggerId length should be less then 1000'),
        param('id').not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        (req: Request, res: Response) => {
            const title = req.body.title;
            const shortDescription = req.body.shortDescription;
            const content = req.body.content;
            const bloggerId = +req.body.bloggerId;

            const id = +req.params.id;

            const post = postsRepository.updatePostById(id, title, shortDescription, content, bloggerId)

            if (post) {
                res.status(204).send(post)
            } else {
                errorObj.errorsMessages = [{
                    message: 'Required post not found',
                    field: 'none',
                }]
                res.status(404).send(errorObj)
            }
        })
    .delete('/:id?',
        param('id').not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        (req: Request, res: Response) => {
            const id = +req.params.id;
            // if (!req.params.id) {
            //     errorObj.errorsMessages = [{
            //         message: 'enter input value',
            //         field: 'id',
            //     }]
            //     res.status(404).send(errorObj)
            // }
            const isDeleted = postsRepository.deletePostById(id)
            if (!isDeleted) {
                errorObj.errorsMessages = [{
                    message: 'Required post not found',
                    field: 'none',
                }]
                res.status(404).send(errorObj)
            } else {
                res.send(204)
            }
        })