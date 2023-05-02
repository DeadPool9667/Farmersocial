import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CommentCard from './CommentCard';

const CommentDisplay = ({ comment, post, replyCm, navigation }) => {
  const [showRep, setShowRep] = useState([]);
  const [next, setNext] = useState(1);

  useEffect(() => {
    setShowRep(replyCm.slice(replyCm.length - next));
  }, [replyCm, next]);

  return (
    <View style={{ flex: 1 }}>
      <CommentCard comment={comment} post={post} commentId={comment._id} navigation={navigation}>
        <View style={{ paddingLeft: 16 }}>
          {showRep.map((item, index) => item.reply && (
            <CommentCard key={index} comment={item} post={post} commentId={comment._id} navigation={navigation} />
          ))}
          {replyCm.length - next > 0 ? (
            <TouchableOpacity onPress={() => setNext(next + 10)}>
              <Text style={{ color: 'crimson' }}>See more comments...</Text>
            </TouchableOpacity>
          ) : replyCm.length > 1 && (
            <TouchableOpacity onPress={() => setNext(1)}>
              <Text style={{ color: 'crimson' }}>Hide comments...</Text>
            </TouchableOpacity>
          )}
        </View>
      </CommentCard>
    </View>
  );
};

export default CommentDisplay;
