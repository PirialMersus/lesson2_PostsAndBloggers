import {bloggers} from "./db";

export const bloggersRepository = {
    getBloggers() {
        return bloggers
    },
    getBloggersById(id: number) {
        return bloggers.find(blogger => blogger.id === id)
    },
    deleteBloggerById(id: number) {
        let isDeleted = false;
        for (let i = 0; i < bloggers.length; i++) {
            if (bloggers[i].id === id) {
                bloggers.splice(i, 1)
                isDeleted = true
                break;
            }
        }
        return isDeleted
    },
    updateBloggerById(id: number, name: string, youTubeUrl: string) {
        const blogger = bloggers.find((blogger) => blogger.id === id);

        if (!blogger) return false;
        blogger.youtubeUrl = youTubeUrl
        blogger.name = name
        return blogger

    },
    createBlogger(name: string, youtubeUrl: string) {
        const newBlogger = {
            id: bloggers.length,
            name,
            youtubeUrl
        }
        bloggers.push(newBlogger)
        return newBlogger
    }
}