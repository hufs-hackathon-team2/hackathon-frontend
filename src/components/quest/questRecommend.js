import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function QuestRecommend({ title, onStart, disabled }) {
  return (
    <View style={styles.questRecommend}>
      <Text style={styles.title}>{title}</Text>

      <Pressable 
        style={[styles.startButton, disabled && styles.startButtonDisabled]} 
        onPress={onStart}
        disabled={disabled}>
        <Text style={[styles.startButtonText, disabled && styles.startButtonTextDisabled]}>시작</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  questRecommend: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 15,
    marginRight: 10,
  },
  startButton: {
    backgroundColor: '#2B3245',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  startButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  startButtonTextDisabled: {
    color: '#aaa',
  },
});
