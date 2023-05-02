import { USERS } from "./users";

export const POSTS = [
    {
        imageUrl: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
        user:USERS[0].user,
        likes: 5000,
        caption: 'This is some caption',
        profile_picture: USERS[0].image,
        comments: [
            {
                user: 'aquaman',
                comment: 'hey nice post'
            },
            {
                user: 'superman',
                comment: 'He he hu hu'
            }
        ]
    },
    {
        imageUrl: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg',
        user:USERS[1].user,
        likes: 5500,
        caption: 'This is some caption2',
        profile_picture: USERS[1].image,
        comments: [
            {
                user: 'spiderman',
                comment: 'aoijfjsajdgjhb'
            },
            {
                user: 'batman',
                comment: 'gihihsndvuhdirgb'
            }
        ]
    },
    {
        imageUrl: '',
        user:USERS[2].user,
        likes: 8000,
        caption: 'This is some caption3',
        profile_picture: USERS[2].image,
        comments: [
            {
                user: 'aquaman',
                comment: 'hey nice post'
            },
            {
                user: 'superman',
                comment: 'He he hu hu'
            }
        ]
    },
]

export const postFooterIcons = [
    {
        name: 'Like',
        imageUrl: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/like',
        likedimageUrl: 'https://img.icons8.com/ios-glyphs/90/fa314a/like'
    },
    
    {
        name: 'Comment',
        imageUrl: 'https://img.icons8.com/material-outlined/60/ffffff/speech-bubble'
    },
    
    {
        name: 'Share',
        imageUrl: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/share'
    },
   
    {
        name: 'Save',
        imageUrl: 'https://img.icons8.com/material/60/ffffff/bookmark-outline',
        savedImageUrl: 'https://img.icons8.com/small/60/ffffff/filled-bookmark-ribbon'
    }
]