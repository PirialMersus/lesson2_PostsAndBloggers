import {Request, Response, Router} from 'express'
import {errorObj} from "../index";
import {blogs} from "../repositories/db";
import {postsRepository} from "../repositories/posts-repository";
import {body, param} from 'express-validator';
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";

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
        authMiddleware,
        // contentTypeMiddleWare('application/json'),
        body('title').trim().not().isEmpty().withMessage('enter input value in title field'),
        body('shortDescription').trim().not().isEmpty().withMessage('enter input value in shortDescription field'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('blogId').trim().not().isEmpty().withMessage('enter input value in blogId field'),
        body('title').isLength({max: 30}).withMessage('title length should be less then 30'),
        body('content').isLength({max: 1000}).withMessage('content length should be less then 1000'),
        body('shortDescription').isLength({max: 100}).withMessage('shortDescription length should be less then 100'),
        body('blogId').isLength({max: 1000}).withMessage('blogId length should be less then 1000'),
        inputValidatorMiddleware,
        // authMiddleware,
        (req: Request, res: Response) => {
            const newPost = postsRepository.createPost(req.body.title,
                req.body.shortDescription,
                req.body.content,
                +req.body.blogId)

            if (!newPost) {
                errorObj.errorsMessages = [{
                    message: 'incorrect blog id',
                    field: 'bloggerId',
                }]
                res.status(400).send(errorObj)
            }

            res.status(201).send(newPost)

        })
    .put('/:id?',
        authMiddleware,
        body('blogId').custom((value, {req}) => {
            if (!blogs.find(blogger => blogger.id === +value)) {
                throw new Error('incorrect blogger id');
            }
            // Indicates the success of this synchronous custom validator
            return true;
        }),
        body('blogId').trim().not().isEmpty().withMessage('enter input value in blogId field'),
        body('title').trim().not().isEmpty().withMessage('enter input value in title field'),
        body('shortDescription').trim().not().isEmpty().withMessage('enter input value in shortDescription field'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('title').isLength({max: 30}).withMessage('title length should be less then 30'),
        body('content').isLength({max: 1000}).withMessage('content length should be less then 1000'),
        body('shortDescription').isLength({max: 100}).withMessage('shortDescription length should be less then 100'),
        body('blogId').isLength({max: 1000}).withMessage('blogId length should be less then 1000'),
        param('id').not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        (req: Request, res: Response) => {
            const title = req.body.title;
            const shortDescription = req.body.shortDescription;
            const content = req.body.content;
            const blogId = +req.body.blogId;

            const id = +req.params.id;

            const post = postsRepository.updatePostById(id, title, shortDescription, content, blogId)

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
        authMiddleware,
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