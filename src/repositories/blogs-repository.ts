import {blogs} from "./db";

export const blogsRepository = {
    getBlogs() {
        return blogs
    },
    getBlogById(id: string) {
        return blogs.find(blogger => blogger.id === id)
    },
    deleteBlogById(id: string) {
        let isDeleted = false;
        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].id === id) {
                blogs.splice(i, 1)
                isDeleted = true
                break;
            }
        }
        return isDeleted
    },
    updateBlogById(id: string, name: string, youTubeUrl: string) {
        const blogger = blogs.find((blogger) => blogger.id === id);

        if (!blogger) return false;
        blogger.youtubeUrl = youTubeUrl
        blogger.name = name
        return blogger

    },
    createBlogger(name: string, youtubeUrl: string) {
        const newBlogger = {
            id: blogs.length.toString(),
            name,
            youtubeUrl
        }
        blogs.push(newBlogger)
        return newBlogger
    }
}