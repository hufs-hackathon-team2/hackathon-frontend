import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';

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
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    backgroundColor: COLORS.cardWhite,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.text,
    marginRight: 10,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  startButtonText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.caption,
    color: COLORS.primaryText,
  },

  startButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  startButtonTextDisabled: {
    color: COLORS.disabledText,
  },
});
