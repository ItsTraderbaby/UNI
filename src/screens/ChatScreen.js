import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import BubbleMorph from '../components/BubbleMorph';

const messages = [
  { id: '1', text: "I miss you 💗", emotion: "love" },
  { id: '2', text: "Why didn't you call?", emotion: "anger" },
  { id: '3', text: "That was hilarious 😂", emotion: "funny" },
  { id: '4', text: "How was your day?", emotion: "neutral" },
];

const ChatScreen = () => (
  <View style={styles.container}>
    <FlatList
      data={messages}
      renderItem={({ item }) => (
        <BubbleMorph text={item.text} emotion={item.emotion} />
      )}
      keyExtractor={item => item.id}
      inverted
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafcff', paddingTop: 40 },
});

export default ChatScreen;

