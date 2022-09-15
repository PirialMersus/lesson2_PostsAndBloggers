export interface IBlog {
    id: string,
    name: string,
    youtubeUrl: string
}
export const blogs: Array<IBlog> = [
    {
        id: "0",
        name: 'first blog',
        youtubeUrl: 'https://www.youtube.com/channel/UCNH9VJDJVt8pXg4TEUHh76w'
    },
    {
        id: "1",
        name: 'second blog',
        youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'
    },
]



export interface IPost {
    id: string,
    blogId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogName: string
}
export const posts: Array<IPost> = [
    {
        id: "0",
        blogId: "0",
        title: 'first post',
        shortDescription: 'short description 1',
        content: 'content of the first post',
        blogName: 'zero blog'
    },
    {
        id: "1",
        blogId: "1",
        title: 'second post',
        shortDescription: 'short description 2',
        content: 'content of the second post',
        blogName: 'first blog'
    }
]