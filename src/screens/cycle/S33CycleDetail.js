import { useState, useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityChipBox, CompletedQuestBox, AnalysisBox } from '../../components/cycle/AnalysisBoxes';
import { getFullDate, getDurationDays, EMPTY_DATE } from '../../lib/date';
import { COLORS, FONT, SPACE, RADIUS, PRESSED } from '../../lib/theme';
import { getAnalysis } from '../../lib/api/cycles';

export default function S33CycleDetail({ navigation, route }) {

  // 목록에서 넘겨준 값. 서버 응답을 기다리는 동안 머리말을 먼저 보여준다.
  const cycle = route.params?.cycle ?? {};

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (cycle.cycle_count == null) {
      setError(true);
      setLoading(false);
      return;
    }

    getAnalysis(cycle.cycle_count)
      .then(setAnalysis)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [cycle.cycle_count]);

  const days = getDurationDays(cycle.started_at, cycle.closed_at);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={({ pressed }) => pressed && PRESSED}
        >
          <Text style={styles.close}>닫기</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>{cycle.cycle_count ?? '—'}번째 사이클</Text>

        <Text style={styles.period}>
          {getFullDate(cycle.started_at)} ~ {getFullDate(cycle.closed_at)}
        </Text>

        <Text style={styles.duration}>
          {days ?? EMPTY_DATE}일 동안 이어갔어요
        </Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : error ? (
          <View style={styles.fallback}>
            <Text style={styles.fallbackText}>분석을 불러오지 못했어요</Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>활동 요약</Text>

              <View style={styles.summaryRow}>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryLabel}>활동일</Text>
                  <Text style={styles.summaryValue}>{analysis?.active_days ?? 0}일</Text>
                </View>

                <View style={styles.summaryCell}>
                  <Text style={styles.summaryLabel}>휴식일</Text>
                  <Text style={styles.summaryValue}>{analysis?.rest_days ?? 0}일</Text>
                </View>

                <View style={styles.summaryCell}>
                  <Text style={styles.summaryLabel}>완료한 퀘스트</Text>
                  <Text style={styles.summaryValue}>
                    {analysis?.completed_quests?.length ?? 0}회
                  </Text>
                </View>
              </View>
            </View>

            <AnalysisBox
              title="활동 흐름 인사이트"
              lines={analysis?.activity_analysis}
              unlocked
              dotColor={COLORS.dotLog}
            />

            <AnalysisBox
              title="맞춤 제안"
              lines={analysis?.personalized_analysis}
              unlocked
              dotColor={COLORS.dotQuest}
            />

            <ActivityChipBox
              title="자주 기록한 PLUS Log"
              items={analysis?.top_plus_logs}
              unlocked
            />

            <CompletedQuestBox
              quests={analysis?.completed_quests}
              unlocked
            />
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  topBar: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: SPACE.screen,
  },

  close: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.textSub,
    marginTop: 25,
  },

  container: {
    paddingHorizontal: SPACE.screen,
    paddingBottom: 40,
  },

  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    marginBottom: 6,
  },

  period: {
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.textSub,
  },

  duration: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginBottom: 20,
  },

  summaryBox: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    backgroundColor: COLORS.card,
  },

  summaryTitle: {
    fontFamily: FONT.semibold,
    fontSize: FONT.cardTitle,
    color: COLORS.text,
    paddingVertical: 4,
  },

  summaryRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },

  summaryCell: {
    flex: 1,
  },

  summaryLabel: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginBottom: 4,
  },

  summaryValue: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.text,
  },

  center: {
    paddingVertical: 60,
    alignItems: 'center',
  },

  fallback: {
    paddingVertical: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
    alignItems: 'center',
  },

  fallbackText: {
    fontFamily: FONT.regular,
    fontSize: FONT.body,
    color: COLORS.textSub,
  },
});
