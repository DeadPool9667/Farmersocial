// import React, { useState, useEffect } from 'react'
// import { TouchableOpacity } from 'react-native'
// import CommentDisplay from './comments/CommentDisplay'

// const Comments = ({post}) => {
//     // console.log(post)
//     const [comments, setComments] = useState([])
//     const [showComments, setShowComments] = useState([])
//     const [next, setNext] = useState(2)

//     const [replyComments, setReplyComments] = useState([])

//     useEffect(() => {
//         const newCm = post.comments.filter(cm => !cm.reply)
//         setComments(newCm)
//         setShowComments(newCm.slice(newCm.length - next))
//     },[post.comments, next])

//     useEffect(()=> {
//         const newRep = post.comments.filter(cm => cm.reply)
//         setReplyComments(newRep)
//     }, [post.comments])

//     return (
//         <View>
//             {
//                 showComments.map((comment, index) => (
//                     <CommentDisplay key={index} comment={comment} post={post}
//                     replyCm={replyComments.filter(item => item.reply === comment._id)} />
//                 ))
//             }

//             {
//                 comments.length - next > 0
//                 ? <View
//                 style={{cursor: 'pointer', color: 'crimson'}}
//                 >
//                     <TouchableOpacity onPress={() => setNext(next + 10)}>
//                         <Text>See more comments...</Text>
//                     </TouchableOpacity>
//                 </View>

//                 : comments.length > 2 &&
//                 <View
//                 style={{cursor: 'pointer', color: 'crimson'}}
//                 >
//                     <TouchableOpacity onPress={() => setNext(2)}>
//                         <Text>Hide comments...</Text>
//                     </TouchableOpacity>
//                 </View>
//             }
//         </View>
//     )
// }

// export default Comments
