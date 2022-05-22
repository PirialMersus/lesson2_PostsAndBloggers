export interface blogger {
    id: number,
    name: string,
    youtubeUrl: string
}
export const bloggers: Array<blogger> = [
    {
        id: 0,
        name: 'first blogger',
        youtubeUrl: 'https://www.youtube.com/channel/UCNH9VJDJVt8pXg4TEUHh76w'
    },
    {
        id: 1,
        name: 'second blogger',
        youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'
    },
]



export interface post {
    id: number,
    bloggerId: number,
    title: string,
    shortDescription: string,
    content: string,
    bloggerName: string
}
export const posts: Array<post> = [
    {
        id: 0,
        bloggerId: 0,
        title: 'first post',
        shortDescription: 'short description 1',
        content: 'content of the first post',
        bloggerName: 'first blogger'
    },
    {
        id: 1,
        bloggerId: 1,
        title: 'second post',
        shortDescription: 'short description 2',
        content: 'content of the second post',
        bloggerName: 'firs blogger'
    }
]