// CY 06 사이클 히스토리 (P1)
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { getFullDate, getDateDifference } from "../../lib/date";


const MOCK_HISTORY = [
  {
    id: 3,
    startDate: new Date('2026-07-06'),
    endDate: new Date('2026-07-20'),
    logDays: 11,
    questDone: 4,
    streak: 6,
    restDays: 7,
  },
  {
    id: 2,
    startDate: new Date('2026-06-02'),
    endDate: new Date('2026-06-16'),
    logDays: 7,
    questDone: 3,
    streak: 4,
    restDays: 7,
  },
  {
    id: 1,
    startDate: new Date('2026-04-13'),
    endDate: new Date('2026-05-04'),
    logDays: 14,
    questDone: 5,
    streak: 8,
    restDays: 7,
  },
];



export default function S32CycleHistory({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View>
        <Text style={styles.historyTitle}>Healthy Cycle 히스토리</Text>
        <Text style={styles.historySub}>지금까지 쌓아온 나의 건강 흐름이에요</Text>
      </View>


      {MOCK_HISTORY.map((cycle) => (

        <View key={cycle.id} style={styles.historyBox}>
          <Text style={styles.historyNth}>{cycle.id}번째 사이클</Text>
          <Text style={styles.historyPeriod}>
            {getFullDate(cycle.startDate)} ~ {getFullDate(cycle.endDate)} · {getDateDifference(cycle.startDate, cycle.endDate)}일
          </Text>
          <Text style={styles.historySummary}>
            PLUS Log {cycle.logDays}일 · 퀘스트 {cycle.questDone}회 · 최고 연속 {cycle.streak}일
          </Text>
        </View>

      ))}

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  historyTitle:{
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  historySub:{
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },

  historyBox:{
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
  },

  historyNth:{
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 4,
  },

  historyPeriod:{
    fontSize: 13,
    color: '#888',
  },
  historySummary:{
    fontSize: 13,
    color: '#555',
    marginTop: 6,
  },

})