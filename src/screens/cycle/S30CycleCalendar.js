// CY 02 사이클 달력 시각화 (휴식기 밴드 표시)

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CycleCalendar from '../../components/cycle/CycleCalendar';

import { getDateFormat, getFullDate, getDateDifference } from '../../lib/date';



const MOCK_CYCLES = [
  {
    id: 2,
    startDate: new Date('2026-08-03'),
    endDate: null,
    status: 'ACTIVE',
    logDays: 9,
    questDone: 3,
    streak: 5,
    restDays: 0,
  },
  {
    id: 1,
    startDate: new Date('2026-06-02'),
    endDate: new Date('2026-06-16'),
    status: 'CLOSED',
    logDays: 7,
    questDone: 3,
    streak: 4,
    restDays: 7,
  },
];



const MOCK_LOG_DATES = [
  '2026-06-02', '2026-06-03', '2026-06-04',
  '2026-06-05', '2026-06-07', '2026-06-08',
  '2026-06-09',
];
const MOCK_QUEST_DATES = [
  '2026-06-04', '2026-06-05', '2026-06-06',
  '2026-06-07', '2026-06-08', '2026-06-09',
];

export default function S30CycleCalendar({ navigation }) {
  
  const [cycles] = useState(MOCK_CYCLES);
  const current = cycles[0];
  const previous = cycles[1];
  const CYCLE_COLORS = ['#4A6B4E', '#8CB369', '#6B8E5E'];



  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.header}>Healthy Cycle</Text>

      <Text style={styles.nowCycleTitle}>최근 완료한 Healthy Cycle</Text>

      <Pressable style={styles.HealthyCycleBtn} onPress={() => navigation.navigate('CycleAnalysis')}>
        <Text style={styles.HealthyCycleBtnText}>현재 Healthy Cycle 보기</Text>
      </Pressable>

      <View style={styles.informBox}>

        <Text style={styles.informSub}>지난 기록</Text>
        <Text style={styles.informTitle}>{previous.id}번째 사이클</Text>

        <View style={styles.informRow}>
          <View style={styles.informDetail}>
            <Text>시작일</Text>
            <Text>{getFullDate(previous.startDate)}</Text>
          </View>

          <View style={styles.informDetail}>
            <Text>지속일</Text>
            <Text>{getDateDifference(previous.startDate, previous.endDate)}일</Text>
          </View>

          <View style={styles.informDetail}>
            <Text>결과</Text>
            <Text>경험치 +{previous.logDays * 1 + previous.questDone * 9}</Text>
          </View>          

        </View>

      </View>
      
      <View style={styles.informBox}>
        <Text style={styles.informTitle}>활동 흐름 인사이트</Text>
        <Text style={styles.informSub}>꾸준히 작은 행동을 이어가고 있어요. 최근 일주일 동안 수면과 식사 관련 기록이 자주 등장했어요. 조금씩 쌓이는 습관이 멋진 변화를 만들고 있답니다</Text>
      </View>

      <View style={styles.informBox}>
        <Text style={styles.informTitle}>활동 요약</Text>

        <View style={styles.informRow}>
          <View style={styles.informDetail}>
            <Text>PLUS Log</Text>
            <Text>{previous.logDays}일</Text>
          </View>

          <View style={styles.informDetail}>
            <Text>퀘스트 성공</Text>
            <Text>{previous.questDone}회</Text>
          </View>

          <View style={styles.informDetail}>
            <Text>연속 기록</Text>
            <Text>{previous.streak}일</Text>
          </View>

          <View style={styles.informDetail}>
            <Text>휴식일</Text>
            <Text>{previous.restDays}일</Text>
          </View>          

        </View>

      </View>

      <CycleCalendar cycle={previous} logDates={MOCK_LOG_DATES} questDates={MOCK_QUEST_DATES} />


        <View style={styles.informBox}>
          <Text style={styles.informTitle}>자주 기록한 활동</Text>
          <Text style={styles.informSub}>수분 섭취, 산책, 스트레칭</Text>
        </View>

        <Pressable style={styles.HealthyCycleBtn} onPress={() => navigation.navigate('CycleHistory')}>
          <Text style={styles.HealthyCycleBtnText}>지난 사이클 히스토리 보기</Text>
        </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 35,
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 5,
  },
  nowCycleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
  },

  HealthyCycleBtn: {
    backgroundColor: '#2B3245',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },

  HealthyCycleBtnText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },

  informBox:{
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
  },

  informTitle:{
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 4,
  },

  informSub:{
    fontSize: 13,
    color: '#888',
  },

  informRow:{
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 12,
    gap: 10,
  },

  informDetail:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
