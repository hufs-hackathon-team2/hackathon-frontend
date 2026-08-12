import { Alert, StyleSheet, Text, View,Pressable } from 'react-native';


const styles = StyleSheet.create({
  logItem: {
    padding: 10,
    marginVertical: 10,
  },
  date:{
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content:{
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  contentText:{
    fontSize: 16,
    marginBottom: 5,
  },
  time:{
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trash: {
    fontSize: 16,
    opacity: 0.4,
  },

});

export default function LogItem({ date, time, content, onDelete }) {
  return (
    <View style={styles.logItem}>

      <View style={styles.dateRow}>

        <Text style={styles.date}>{date}</Text>

        <Pressable onPress={onDelete} hitSlop={10}>
          <Text style={styles.trash}>🗑️</Text>
        </Pressable>

      </View>

      <View style={styles.content}>

        <Text style={styles.contentText}>{content}</Text>
        <Text style={styles.time}>{time}</Text>

      </View>
    </View>
  );
}

