import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CommentDisplay from './CommentDisplay';

const Comments = ({ post, navigation }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [next, setNext] = useState(2);
  const [replyComments, setReplyComments] = useState([]);

  useEffect(() => {
    const newCm = post.comments.filter((cm) => !cm.reply);
    setComments(newCm);
    setShowComments(newCm.slice(newCm.length - next));
  }, [post.comments, next]);

  useEffect(() => {
    const newRep = post.comments.filter((cm) => cm.reply);
    setReplyComments(newRep);
  }, [post.comments]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {showComments.map((comment, index) => (
        <CommentDisplay
          key={index}
          comment={comment}
          post={post}
          replyCm={replyComments.filter((item) => item.reply === comment._id)}
          navigation={navigation}
        />
      ))}

      {comments.length - next > 0 ? (
        <TouchableOpacity
          style={{
            padding: 10,
            borderTopWidth: 1,
            borderTopColor: '#ccc',
            backgroundColor: 'black'
          }}
          onPress={() => setNext(next + 10)}>
          <Text style={{color: 'crimson'}}>See more comments...</Text>
        </TouchableOpacity>
      ) : comments.length > 1 ? (
        <TouchableOpacity
          style={{
            padding: 10,
            borderTopWidth: 1,
            borderTopColor: '#ccc',
            backgroundColor: 'black'
          }}
          onPress={() => setNext(2)}>
          <Text style={{color: 'crimson',}}>Hide comments...</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Comments;
