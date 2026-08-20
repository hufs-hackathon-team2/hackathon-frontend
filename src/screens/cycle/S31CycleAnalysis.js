import { useState, useEffect } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CycleCalendar from '../../components/cycle/CycleCalendar';
import { ActivityChipBox, CompletedQuestBox, AnalysisBox } from '../../components/cycle/AnalysisBoxes';

import { getFullDate, getDurationDays, EMPTY_DATE } from '../../lib/date';
import { getSticker } from '../../lib/assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';

import { getCurrentAnalysis, requestCurrentAnalysis } from '../../lib/api/cycles';
import { ActivityIndicator } from 'react-native';

const MAX_ANALYSIS = 3;

export default function S31CycleAnalysis ({ navigation }) {

  const [status, setStatus] = useState('IDLE');
  const [count, setCount] = useState(0);

  const requestAnalysis = () => {
    setStatus('PENDING');

    requestCurrentAnalysis()
      .then((result) => {
        setAnalysis(result);

        setCount((used) => result.analysis_request_count ?? used + 1);
        setStatus('DONE');
      })
      .catch((error) => {
        setStatus('IDLE');

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

        const requested = result.analysis_request_count;
        const hasContent = (result.activity_analysis ?? []).some((line) => line?.trim());

        if (requested != null ? requested > 0 : hasContent) setStatus('DONE');

        if (requested != null) setCount(requested);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();

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

  // 휴식기에 들어가면 지속일은 쉬기 시작한 날에서 멈춘다.
  const resting = analysis.rest_started_at != null;
  const durationEnd = resting ? analysis.rest_started_at : new Date();
  const duration = getDurationDays(analysis.started_at, durationEnd);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.nowCycleTitle}>진행 중인 Healthy Cycle</Text>

        <Pressable
          style={styles.historyButton}
          onPress={() => navigation.navigate('CycleHistory')}
        >
          <Text style={styles.historyButtonText}>히스토리 보기</Text>
        </Pressable>

        <View style={styles.informBox}>
          <Text style={styles.informSub}>{resting ? '휴식 중' : '활동 중'}</Text>
          <Text style={styles.informTitle}>사이클 {analysis.cycle_count}회차</Text>

          <View style={styles.informRow}>
            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>시작일</Text>
              <Text style={styles.detailValue}>{getFullDate(analysis.started_at)}</Text>
            </View>

            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>지속일</Text>
              <Text style={styles.detailValue}>
                {duration ?? EMPTY_DATE}일{resting ? '' : '째'}
              </Text>
            </View>

            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>상태</Text>
              <Text style={[styles.detailStatus, resting && styles.detailStatusRest]}>
                {resting ? '휴식 중' : '활동 중 ↗'}
              </Text>
            </View>

          </View>

        </View>

        <View style={styles.insightBox}>
          <Text style={styles.informTitle}>활동 요약</Text>

          <View style={styles.informRow}>
            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>활동일</Text>
              <Text style={styles.detailValue}>{analysis.active_days ?? 0}일</Text>
            </View>

            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>퀘스트 성공</Text>
              <Text style={styles.detailValue}>{analysis.completed_quests?.length ?? 0}회</Text>
            </View>

            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>휴식일</Text>
              <Text style={styles.detailValue}>{analysis.rest_days ?? 0}일</Text>
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
          title="자주 기록한 PLUS Log"
          items={analysis.top_plus_logs}
          unlocked={status === 'DONE'}
        />

        <CompletedQuestBox
          quests={analysis.completed_quests}
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

  historyButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.navigate,
    borderRadius: 999,
    paddingVertical: 11,
    marginBottom: 16,
  },

  historyButtonText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.navigate,
  },
  nowCycleTitle: {
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingVertical: 15,
  },

  detailStatusRest: {
    color: COLORS.textSub,
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

});
