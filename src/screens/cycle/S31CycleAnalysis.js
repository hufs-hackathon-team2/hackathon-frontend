import { useState, useEffect } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CycleCalendar from '../../components/cycle/CycleCalendar';

import { getFullDate } from '../../lib/date';
import { getSticker } from '../../lib/assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';

import { getCurrentAnalysis, requestCurrentAnalysis } from '../../lib/api/cycles';
import { ActivityIndicator } from 'react-native';

const MAX_ANALYSIS = 3;


const QUEST_PAGE = 5;

const CHIP_COLORS = [
  COLORS.chip1,
  COLORS.chip2,
  COLORS.chip3,
  COLORS.chip4,
  COLORS.chip5,
];

function ActivityChipBox({ title, items, unlocked }) {

  const list = (items ?? []).filter((item) => item?.plus_log_content?.trim());

  return (
    <View style={styles.activityBox}>
      <Text style={styles.informTitle}>{title}</Text>

      {!unlocked ? (
        <Text style={styles.lockText}>분석을 요청하면 볼 수 있어요</Text>
      ) : list.length === 0 ? (
        <Text style={styles.lockText}>아직 기록이 충분하지 않아요</Text>
      ) : (
        <View style={styles.activityList}>
          {list.map((item, i) => (
            <View
              key={item.plus_log_content}
              style={[styles.activityRow, { backgroundColor: CHIP_COLORS[i % CHIP_COLORS.length] }]}
            >
              <Image source={getSticker(item.asset)} style={styles.activityIcon} resizeMode="contain" />

              <Text style={styles.activityText} numberOfLines={3}>
                {item.plus_log_content}
              </Text>

              <Text style={styles.activityCount}>{item.plus_log_count ?? 0}회</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}


function CompletedQuestBox({ quests, unlocked }) {
  const list = (quests ?? []).filter((name) => name?.trim());
  const [shown, setShown] = useState(QUEST_PAGE);

  const visible = list.slice(0, shown);
  const hasMore = list.length > shown;

  return (
    <View style={styles.insightBox}>
      <Text style={styles.informTitle}>완료한 퀘스트</Text>

      {!unlocked ? (
        <Text style={styles.lockText}>분석을 요청하면 볼 수 있어요</Text>
      ) : list.length === 0 ? (
        <Text style={styles.lockText}>아직 완료한 퀘스트가 없어요</Text>
      ) : (
        <>
          <View style={styles.suggestList}>
            {visible.map((name, i) => (
              <View key={i} style={styles.suggestRow}>
                <Text style={styles.questCheck}>✓</Text>
                <Text style={styles.suggestText}>{name}</Text>
              </View>
            ))}
          </View>

          {hasMore && (
            <Pressable
              style={styles.moreButton}
              onPress={() => setShown(shown + QUEST_PAGE)}
            >
              <Text style={styles.moreButtonText}>더보기</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

function AnalysisBox({ title, lines, unlocked, dotColor }) {

  const list = (lines ?? []).filter((line) => line?.trim());

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
              <Text style={styles.detailValue}>{getFullDate(analysis.started_at)}</Text>
            </View>

            <View style={styles.informDetail}>
              <Text style={styles.detailLabel}>지속일</Text>
              <Text style={styles.detailValue}>{analysis.active_days ?? 0}일째</Text>
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

  questCheck: {
    fontFamily: FONT.semibold,
    fontSize: FONT.caption,
    color: COLORS.primary,
    lineHeight: 15,
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
  activityList: {
    gap: 8,
    marginTop: 10,
  },

  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: RADIUS.button,
  },

  activityIcon: {
    width: 20,
    height: 20,
  },

  activityText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.text,
    lineHeight: 18,
  },

  moreButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 12,
  },

  moreButtonText: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
  },

  activityCount: {
    fontFamily: FONT.semibold,
    fontSize: FONT.caption,
    color: COLORS.textSub,
  },

});
