import {blogs, posts} from "./db";

export const postsRepository = {
    getPosts() {
        return posts
    },
    getPostsById(id: number) {
        return posts.find(post => post.id === id)
    },
    deletePostById(id: number) {
        let isDeleted = false;
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1)
                isDeleted = true
                break;
            }
        }
        return isDeleted
    },
    updatePostById(id: number,
                   title: string,
                   shortDescription: string,
                   content: string,
                   bloggerId: number) {
        const post = posts.find((post) => post.id === id);
        if (!post) return false

        post.title = title
        post.shortDescription = shortDescription
        post.content = content
        post.blogId = bloggerId

        return post

    },
    createPost(title: string, shortDescription: string, content: string, blogId: number) {
        const blogName = blogs.find(blog => blog.id === blogId)
        if (!blogName) return false
        const newPost = {
            id: posts.length,
            title,
            shortDescription,
            content,
            blogId,
            blogName: blogName ? blogName.name : 'unknown'
        }
        posts.push(newPost)
        return newPost
    }
}