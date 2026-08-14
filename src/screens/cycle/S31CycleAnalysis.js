import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CycleCalendar from '../../components/cycle/CycleCalendar';

import { getFullDate, getDateDifference } from '../../lib/date';


const MOCK_CYCLES = [
  {
    id: 2,
    startDate: new Date('2026-08-03'),
    endDate: null,
    status: 'ACTIVE',
    logDays: 9,
    questDone: 3,
    streak: 4,
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
  '2026-08-03', '2026-08-04', '2026-08-06',
  '2026-08-07', '2026-08-08', '2026-08-12',
  '2026-08-13', '2026-08-14', '2026-08-15',
];

const MOCK_QUEST_DATES = [
  '2026-08-04', '2026-08-05', '2026-08-06',
  '2026-08-07', '2026-08-08', '2026-08-09',
  '2026-08-13', '2026-08-14', '2026-08-15',
];
const MAX_ANALYSIS = 3;

function AnalysisBox({ title, content, unlocked }) {
  return (
    <View style={styles.informBox}>
      <Text style={styles.informTitle}>{title}</Text>

      {unlocked ? (
        <Text style={styles.informSub}>{content}</Text>
      ) : (
        <Text style={styles.lockText}>분석을 요청하면 볼 수 있어요</Text>
      )}
    </View>
  );
}

export default function S31CycleCalendar({ navigation }) {

  const [cycles] = useState(MOCK_CYCLES);
  const current = cycles[0];


  const [status, setStatus] = useState('IDLE');
  const [count, setCount] = useState(0);

  const requestAnalysis = () => {
    setStatus('PENDING');
    setCount(count + 1);

    // API 붙으면 이자리에 fetch
    setTimeout(() => setStatus('DONE'), 2000);
  };


  const usedUp = count >= MAX_ANALYSIS;

  let buttonText = `분석 결과 요청하기 (${MAX_ANALYSIS - count}회 남음)`;
  if (status === 'PENDING') buttonText = '분석 중이에요…';
  if (usedUp) buttonText = '이번 사이클 분석을 다 썼어요';


  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.nowCycleTitle}>진행 중인 Healthy Cycle</Text>

      <View style={styles.informBox}>
        <Text style={styles.informSub}>진행 중</Text>
        <Text style={styles.informTitle}>{current.id}번째 사이클</Text>

        <View style={styles.informRow}>
          <View style={styles.informDetail}>
            <Text>시작일</Text>
            <Text>{getFullDate(current.startDate)}</Text>
          </View>

          <View style={styles.informDetail}>
            <Text>지속일</Text>
            <Text>{getDateDifference(current.startDate, new Date())}일</Text>
          </View>

          <View style={styles.informDetail}>
            <Text>누적 경험치</Text>
            <Text>+{current.logDays * 1 + current.questDone * 9}</Text>
          </View>

        </View>

      </View>
      
      <View style={styles.informBox}>
        <Text style={styles.informTitle}>활동 요약</Text>

        <View style={styles.informRow}>
          <View style={styles.informDetail}>
            <Text>PLUS Log</Text>
            <Text>{current.logDays}일</Text>
          </View>
          
          <View style={styles.informDetail}>
            <Text>퀘스트 성공</Text>
            <Text>{current.questDone}회</Text>
          </View>

          <View style={styles.informDetail}>
            <Text>연속 기록</Text>
            <Text>{current.streak}일</Text>
          </View>

          <View style={styles.informDetail}>
            <Text>휴식일</Text>
            <Text>{current.restDays}일</Text>
          </View>

        </View>
      </View>

      <CycleCalendar cycle={current} logDates={MOCK_LOG_DATES} questDates={MOCK_QUEST_DATES} />

      <AnalysisBox
        title="활동 흐름 인사이트"
        content="꾸준히 작은 행동을 이어가고 있어요. 최근 일주일 동안 수면과 식사 관련 기록이 자주 등장했어요. 조금씩 쌓이는 습관이 멋진 변화를 만들고 있답니다"
        unlocked={status === 'DONE'}
      />

      <AnalysisBox
        title="자주 기록한 활동"
        content="수분 섭취, 산책, 스트레칭"
        unlocked={status === 'DONE'}
      />

        <Pressable
          style={[styles.HealthyCycleBtn, (status === 'PENDING' || usedUp) && styles.HealthyCycleBtnPending]}
          onPress={requestAnalysis}
          disabled={status === 'PENDING' || usedUp}
        >
          <Text style={styles.HealthyCycleBtnText}>{buttonText}</Text>
        </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  nowCycleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
  },

  HealthyCycleBtn: {
    backgroundColor: '#2B3245',
    borderWidth: 1,
    borderColor: '#2B3245',
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
  HealthyCycleBtnPending: {
    backgroundColor: '#B8BDC7',
    borderColor: '#B8BDC7',
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

  lockText: {
    fontSize: 13,
    color: '#AAA',
    fontStyle: 'italic',
  },
});
