import React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

const CustomIcons = ({ setContent, content, theme }) => {
  const { width: SCREEN_WIDTH } = Dimensions.get('window')

  const reactions = [
    '❤️', '😆', '😯', '😢', '😡', '👍', '👎', '😄',
    '😂', '😍', '😘', '😗', '😚', '😳', '😭', '😓',
    '😤', '🤤', '👻', '💀', '🤐', '😴', '😷', '😵'
  ];

  const [showReactions, setShowReactions] = useState(false);

  const toggleReactions = () => {
    setShowReactions(!showReactions);
  }

  return (
    <View style={{ opacity: 1, flexDirection: 'row'}}>
      <TouchableOpacity onPress={toggleReactions}>
        <Text style={{ opacity: 0.8 }}>{'😄'}</Text>
      </TouchableOpacity>

      {showReactions &&
        <View style={{ position: 'absolute', top: -90, left: SCREEN_WIDTH/4 }}>
          <View style={{ backgroundColor: 'black', padding: 5, flexDirection: 'row', flexWrap: 'wrap', width: 200, borderRadius: 5 }}>
            {
              reactions.map(icon => (
                <TouchableOpacity style={{padding: 10}} key={icon} onPress={() => setContent(content + icon)}>
                  <Text style={{ color: 'black' }}>
                    {icon}
                  </Text>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>
      }
    </View>
  )
}

export default CustomIcons;
