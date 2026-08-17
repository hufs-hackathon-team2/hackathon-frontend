// CY 06 사이클 히스토리 (P1)
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { getFullDate, getDateDifference } from "../../lib/date";
import { COLORS, FONT, WEIGHT, SPACE, RADIUS } from '../../lib/theme';


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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.historyTitle}>Healthy Cycle 히스토리</Text>

      <Text style={styles.historySub}>지금까지 쌓아온 나의 건강 흐름이에요</Text>


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
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  container: {
    paddingHorizontal: SPACE.screen,
    backgroundColor: COLORS.bg,
    flexGrow: 1,
  },

  historyTitle:{
    fontSize: FONT.title,
    fontWeight: WEIGHT.bold,
    color: COLORS.text,
    paddingVertical: 15,
  },
  historySub:{
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginBottom: 20,
  },

  historyBox:{
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    backgroundColor: COLORS.cardWhite,
  },

  historyNth:{
    fontSize: FONT.cardTitle,
    fontWeight: '600',
    color: COLORS.text,
    paddingVertical: 5,
  },

  historyPeriod:{
    fontSize: FONT.body,
    color: COLORS.textSub,
  },

  historySummary:{
    fontSize: FONT.caption,
    color: COLORS.text,
    marginTop: 6,
  },
});
