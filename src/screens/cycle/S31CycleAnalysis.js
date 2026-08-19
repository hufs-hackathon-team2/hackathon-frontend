import { useState, useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CycleCalendar from '../../components/cycle/CycleCalendar';

import { getFullDate, getDateDifference } from '../../lib/date';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { COLORS, FONT, WEIGHT, SPACE, RADIUS } from '../../lib/theme';

import { getCurrentAnalysis, requestCurrentAnalysis } from '../../lib/api/cycles';
import { ActivityIndicator } from 'react-native';

const MAX_ANALYSIS = 3;

const CHIP_COLORS = [
  COLORS.chip1,
  COLORS.chip2,
  COLORS.chip3,
  COLORS.chip4,
  COLORS.chip5,
];

function ActivityChipBox({ title, items, unlocked }) {
  // 서버가 아직 안 주거나 기록이 없으면 빈 배열로 다룬다
  const list = items ?? [];

  return (
    <View style={styles.activityBox}>
      <Text style={styles.informTitle}>{title}</Text>

      {!unlocked ? (
        <Text style={styles.lockText}>분석을 요청하면 볼 수 있어요</Text>
      ) : list.length === 0 ? (
        <Text style={styles.lockText}>아직 기록이 충분하지 않아요</Text>
      ) : (
        <View style={styles.chipRow}>
          {list.map((item, i) => (
            <View
              key={item.activity_name}
              style={[styles.chip, { backgroundColor: CHIP_COLORS[i % CHIP_COLORS.length] }]}
            >
              <Text style={styles.chipText}>{item.activity_name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function AnalysisBox({ title, lines, unlocked, dotColor }) {
  // 서버가 아직 안 주거나 분석 전이면 빈 배열로 다룬다
  const list = lines ?? [];

  return (
    <View style={styles.insightBox}>
      <Text style={styles.informTitle}>{title}</Text>

      {!unlocked ? (
        <Text style={styles.lockText}>분석을 요청하면 볼 수 있어요</Text>
      ) : list.length === 0 ? (
        <Text style={styles.lockText}>아직 기록이 충분하지 않아요</Text>
      ) : (
        <View style={styles.suggestList}>
          {list.map((line, i) => (
            <View key={i} style={styles.suggestRow}>
              <View style={[styles.suggestDot, { backgroundColor: dotColor }]} />
              <Text style={styles.suggestText}>{line}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function S31CycleAnalysis ({ navigation }) {


  const [status, setStatus] = useState('IDLE');
  const [count, setCount] = useState(0);

  // 서버가 분석까지 마치고 결과를 한 번에 준다. 따로 조회하지 않는다.
  const requestAnalysis = () => {
    setStatus('PENDING');

    requestCurrentAnalysis()
      .then((result) => {
        setAnalysis(result);
        // 사용 횟수는 서버가 세어 응답에 담아준다
        setCount((used) => result.analysis_request_count ?? used + 1);
        setStatus('DONE');
      })
      .catch((error) => {
        setStatus('IDLE');

        // 429 는 이번 사이클 분석 횟수를 다 쓴 것. 횟수 판정은 서버가 한다.
        if (error.response?.status === 429) {
          setCount(MAX_ANALYSIS);
          Alert.alert('분석을 다 썼어요', '이번 사이클에서는 더 요청할 수 없어요');
          return;
        }

        Alert.alert('분석하지 못했어요', '잠시 후 다시 시도해주세요');
      });
  };


  const usedUp = count >= MAX_ANALYSIS;

  let buttonText = `분석 결과 요청하기 (${MAX_ANALYSIS - count}회 남음)`;
  if (status === 'PENDING') buttonText = '분석 중이에요…';
  if (usedUp) buttonText = '이번 사이클 분석을 다 썼어요';

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);

    getCurrentAnalysis()
      .then((result) => {
        setAnalysis(result);

        // 이미 분석을 마친 사이클이면 잠금을 풀어둔다.
        // 화면을 나갔다 들어와도 결과가 그대로 보인다.
        if (result.activity_analysis?.length) setStatus('DONE');
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();

    // 실패한 채로 남지 않도록 화면에 들어올 때마다 다시 불러온다
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !analysis) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>분석 정보를 불러오지 못했어요</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.nowCycleTitle}>진행 중인 Healthy Cycle</Text>

        <View style={styles.informBox}>
          <Text style={styles.informSub}>활동 중</Text>
          <Text style={styles.informTitle}>사이클 {analysis.cycle_count}회차</Text>

          <View style={styles.informRow}>
            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>시작일</Text>
              <Text style={styles.detailValue}>{getFullDate(new Date(analysis.started_at))}</Text>
            </View>

            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>지속일</Text>
              <Text style={styles.detailValue}>{analysis.active_days}일째</Text>
            </View>

            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>상태</Text>
              <Text style={styles.detailStatus}>활동 중 ↗</Text>
            </View>

          </View>

        </View>
        
        <View style={styles.insightBox}>
          <Text style={styles.informTitle}>활동 요약</Text>

          <View style={styles.informRow}>
            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>활동일</Text>
              <Text style={styles.detailValue}>{analysis.active_days}일</Text>
            </View>

            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>퀘스트 성공</Text>
              <Text style={styles.detailValue}>{analysis.completed_quests?.length ?? 0}회</Text>
            </View>

            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>휴식일</Text>
              <Text style={styles.detailValue}>{analysis.rest_days}일</Text>
            </View>

          </View>
        </View>

        <CycleCalendar
          cycle={{ startDate: new Date(analysis.started_at) }}
          logDates={analysis.logDates}
          questDates={analysis.questDates}
        />

        <AnalysisBox
          title="활동 흐름 인사이트"
          lines={analysis.activity_analysis}
          unlocked={status === 'DONE'}
          dotColor={COLORS.navigate}
        />

        <AnalysisBox
          title="이렇게 해보세요"
          lines={analysis.personalized_analysis}
          unlocked={status === 'DONE'}
          dotColor={COLORS.navigate}
        />

        <ActivityChipBox
          title="자주 기록한 활동"
          items={analysis.top_plus_logs}
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

  nowCycleTitle: {
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingVertical: 15,
  },

  HealthyCycleBtn: {
    alignSelf: 'center',
    backgroundColor: COLORS.navigate,
    borderWidth: 1,
    borderColor: COLORS.navigate,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 5,
    marginBottom: 15,
  },

  HealthyCycleBtnText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.navigateText,
    textAlign: 'center',
  },
  HealthyCycleBtnPending: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.disabled,
  },

  informBox:{
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    backgroundColor: COLORS.card,
  },

  insightBox:{
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    backgroundColor: COLORS.cardAlt,
  },
  activityBox:{
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    backgroundColor: COLORS.cardWhite,
  },

  informTitle:{
    fontFamily: FONT.semibold,
    fontSize: FONT.cardTitle,
    color: COLORS.text,
    paddingVertical: 4,
  },

  informSub:{
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
  },

  detailLabel: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginBottom: 4,
  },

  detailValue: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.text,
  },
  detailStatus: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.primary,
  },

  informRow:{
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 5,
    gap: 10,
  },

  informDetail:{
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  suggestList: {
    marginTop: 10,
    gap: 10,
  },

  suggestRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },

  suggestDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginTop: 5,
  },

  suggestText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.text,
    lineHeight: 15,
  },

  lockText: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    fontStyle: 'italic',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACE.screen,
    backgroundColor: COLORS.bg,
  },

  errorText: {
    fontFamily: FONT.regular,
    fontSize: FONT.body,
    color: COLORS.textSub,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },

  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  chipText: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.text,
  },

});
