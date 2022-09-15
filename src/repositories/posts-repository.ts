import {blogs, posts} from "./db";

export const postsRepository = {
    getPosts() {
        return posts
    },
    getPostsById(id: string) {
        return posts.find(post => post.id === id)
    },
    deletePostById(id: string) {
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
    updatePostById(id: string,
                   title: string,
                   shortDescription: string,
                   content: string,
                   bloggerId: string) {
        const post = posts.find((post) => post.id === id);
        if (!post) return false

        post.title = title
        post.shortDescription = shortDescription
        post.content = content
        post.blogId = bloggerId

        return post

    },
    createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const blogName = blogs.find(blog => blog.id === blogId)
        if (!blogName) return false
        const newPost = {
            id: posts.length.toString(),
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