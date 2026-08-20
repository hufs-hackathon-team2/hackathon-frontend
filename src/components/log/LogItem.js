import { Alert, StyleSheet, Text, View,Pressable } from 'react-native';
import { COLORS, FONT, SPACE, RADIUS, PRESSED } from '../../lib/theme';


const styles = StyleSheet.create({
  logItem: {
    padding: 5,
    marginVertical: 5,
  },
  date:{
    fontFamily: FONT.bold,
    fontSize: FONT.cardTitle,
    color: COLORS.navigate,
  },
  content:{
    marginBottom: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
    padding: 20,
  },
  contentText:{
    fontFamily: FONT.regular,
    fontSize: FONT.body,
    color: COLORS.text,
  },
  time:{
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trash: {
    fontFamily: FONT.semibold,
    fontSize: 16,
    color: COLORS.textSub,
    opacity: 0.4,
  },

});

export default function LogItem({ date, time, content, onDelete }) {
  return (
    <View style={styles.logItem}>

      <View style={styles.dateRow}>

        <Text style={styles.date}>{date}</Text>

        <Pressable
          onPress={onDelete}
          hitSlop={10}
          style={({ pressed }) => pressed && PRESSED}
        >
          <Text style={styles.trash}>X</Text>
        </Pressable>

      </View>

      <View style={styles.content}>

        <Text style={styles.time}>{time}</Text>
        <Text style={styles.contentText}>{content}</Text>

      </View>
    </View>
  );
}

