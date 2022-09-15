import {Request, Response, Router} from 'express'
import {blogsRepository} from "../repositories/blogs-repository";
import {errorObj} from "../index";
import {blogs} from "../repositories/db";
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {body, param} from "express-validator";
import {authMiddleware} from "../middlewares/auth-middleware";

// put here array with videos
export const blogsRouter = Router({})

blogsRouter.get('/', (req: Request, res: Response) => {
    const blogs = blogsRepository.getBlogs()
    res.send(blogs);
})
    .get('/:blogId?',
        param('blogId').not().isEmpty().withMessage('enter blogId value in params'),
        inputValidatorMiddleware,
        (req: Request, res: Response) => {
            const id = req.params.bloggerId;

            const blog = blogsRepository.getBlogById(id)
            if (blog) {
                res.send(blog)
            } else {
                res.send(404)
            }
        })
    .post('/',
        // body('youtubeUrl').trim().not().isEmpty().withMessage('enter input value in youtubeUrl field'),
        authMiddleware,

        body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('youtubeUrl').isLength({max: 100}).withMessage('youtubeUrl length should be less then 100'),
        body('name').isLength({max: 15}).withMessage('name length should be less then 15'),
        body('youtubeUrl').custom((value, {req}) => {
            const regExp = new RegExp("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
            if (!regExp.test(req.body.youtubeUrl)) {
                throw new Error('enter correct value');
            }

            // Indicates the success of this synchronous custom validator
            return true;
        }),
        inputValidatorMiddleware,
        (req: Request, res: Response) => {

            const newBlogger = blogsRepository.createBlogger(req.body.name, req.body.youtubeUrl)

            res.status(201).send(newBlogger)

        })
    .put('/:id?',
        authMiddleware,
        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
        // body('youtubeUrl').not().isEmpty().withMessage('enter input value in youtubeUrl field'),
        body('youtubeUrl').isLength({max: 100}).withMessage('youtubeUrl length should be less then 100'),
        body('name').isLength({max: 15}).withMessage('name length should be less then 15'),
        body('youtubeUrl').custom((value, {req}) => {
            const regExp = new RegExp("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
            if (!regExp.test(req.body.youtubeUrl)) {
                throw new Error('enter correct value');
            }

            // Indicates the success of this synchronous custom validator
            return true;
        }),
        inputValidatorMiddleware,
        (req: Request, res: Response) => {
            const name = req.body.name;
            const youtubeUrl = req.body.youtubeUrl;

            // if (!name) {
            //     errorObj.errorsMessages = [{
            //         message: 'enter input value',
            //         field: 'name',
            //     }]
            //     res.status(400).send(errorObj)
            // }
            // if (!youtubeUrl) {
            //     errorObj.errorsMessages = [{
            //         message: 'enter input value',
            //         field: 'youtubeUrl',
            //     }]
            //     res.status(400).send(errorObj)
            // }
            // if (req.body.name.length > 15) {
            //     errorObj.errorsMessages = [{
            //         message: 'name length should be less then 15',
            //         field: 'name',
            //     }]
            //     res.status(400).send(errorObj)
            // }
            // if (req.body.youtubeUrl.length > 100) {
            //     errorObj.errorsMessages = [{
            //         message: 'youtubeUrl length should be less then 100',
            //         field: 'youtubeUrl',
            //     }]
            //     res.status(400).send(errorObj)
            // }
            // const regExp = new RegExp("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
            // if (!regExp.test(req.body.youtubeUrl)) {
            //     errorObj.errorsMessages = [{
            //         message: 'enter correct value',
            //         field: 'youtubeUrl',
            //     }]
            //     res.status(400).send(errorObj)
            // }

            const id = req.params.id;
            const blog = blogsRepository.updateBlogById(id, name, youtubeUrl)

            if (blog) {
                res.status(204).send(blog)
            } else {
                errorObj.errorsMessages = [{
                    message: 'Required blog not found',
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
            const id = req.params.id;

            const isDeleted = blogsRepository.deleteBlogById(id)


            if (!isDeleted) {
                errorObj.errorsMessages = [{
                    message: 'Required blog not found',
                    field: 'none',
                }]
                res.status(404).send(errorObj)
            } else {
                for (let i = 0; i < blogs.length; i++) {
                    if (blogs[i].id === id) {
                        blogs.splice(i, 1)
                        break;
                    }
                }
                res.send(204)
            }
        })