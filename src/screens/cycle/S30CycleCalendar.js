// CY 02 사이클 달력 시각화 (휴식기 밴드 표시)

import { useState, useEffect } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CycleCalendar from '../../components/cycle/CycleCalendar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getFullDate } from '../../lib/date';
import { getSticker } from '../../lib/assets';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';
import { getPreviousAnalysis } from '../../lib/api/cycles';



const CHIP_COLORS = [
  COLORS.chip1,
  COLORS.chip2,
  COLORS.chip3,
  COLORS.chip4,
  COLORS.chip5,
];

export default function S30CycleCalendar({ navigation }) {

  const insets = useSafeAreaInsets();

  const [previous, setPrevious] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);

    getPreviousAnalysis()
      .then(setPrevious)
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

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>사이클 정보를 불러오지 못했어요</Text>
      </View>
    );
  }

  // 첫 사이클이면 완료된 사이클이 아직 없다. 오류가 아니라 정상 상태다.
  if (!previous) {
    return (
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 5 }]}>

        <Text style={styles.nowCycleTitle}>최근 완료한 Healthy Cycle</Text>

        <View style={styles.cycleBtnRow}>
          <Pressable style={styles.cycleBtnFill} onPress={() => navigation.navigate('CycleAnalysis')}>
            <Text style={styles.cycleBtnFillText}>현재 사이클 보기</Text>
          </Pressable>

          <Pressable style={styles.cycleBtnLine} onPress={() => navigation.navigate('CycleHistory')}>
            <Text style={styles.cycleBtnLineText}>히스토리 보기</Text>
          </Pressable>
        </View>

        <View style={styles.emptyBox}>
          <View style={styles.emptyIconBadge}>
            <Image source={getSticker('sprout')} style={styles.emptyIcon} resizeMode="contain" />
          </View>

          <Text style={styles.emptyTitle}>아직 완료한 사이클이 없어요</Text>

          <Text style={styles.emptyDescription}>
            지금 첫 사이클을 이어가는 중이에요{'\n'}
            사이클이 끝나면 여기에서 돌아볼 수 있어요
          </Text>
        </View>

      </ScrollView>
    );
  }

  const completedQuests = (previous.completed_quests ?? []).filter((name) => name?.trim());

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 5 }]}>

      <Text style={styles.nowCycleTitle}>최근 완료한 Healthy Cycle</Text>

      <View style={styles.cycleBtnRow}>
        <Pressable style={styles.cycleBtnFill} onPress={() => navigation.navigate('CycleAnalysis')}>
          <Text style={styles.cycleBtnFillText}>현재 사이클 보기</Text>
        </Pressable>

        <Pressable style={styles.cycleBtnLine} onPress={() => navigation.navigate('CycleHistory')}>
          <Text style={styles.cycleBtnLineText}>히스토리 보기</Text>
        </Pressable>
      </View>

      <View style={styles.informBox}>

        <Text style={styles.informSub}>지난 기록</Text>
        <Text style={styles.informTitle}>{previous.cycle_count}번째 사이클</Text>

        <View style={styles.informRow}>
          <View style={styles.informDetail}>
            <Text style={styles.detailLabel}>시작일</Text>
            <Text style={styles.detailValue}>{getFullDate(previous.started_at)}</Text>
          </View>

          <View style={styles.informDetail}>
            <Text style={styles.detailLabel}>지속일</Text>
            <Text style={styles.detailValue}>{previous.active_days ?? 0}일</Text>
          </View>

          <View style={styles.informDetail}>
            <Text style={styles.detailLabel}>결과</Text>
            <Text style={styles.detailActivity}>경험치 +{(previous.active_days ?? 0) + (previous.completed_quests?.length ?? 0) * 3}</Text>
          </View>

        </View>

      </View>
      
      <View style={styles.insightBox}>
        <Text style={styles.informTitle}>활동 흐름 인사이트</Text>

        <View style={styles.suggestList}>
          {(previous.activity_analysis ?? []).filter((line) => line?.trim()).map((line, i) => (
            <View key={i} style={styles.suggestRow}>
              <View style={styles.suggestDot} />
              <Text style={styles.suggestText}>{line}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.insightBox}>
        <Text style={styles.informTitle}>활동 요약</Text>

        <View style={styles.informRow}>

          <View style={styles.informDetail}>
            <Text style={styles.detailLabel}>활동일</Text>
            <Text style={styles.detailValue}>{previous.active_days ?? 0}일</Text>
          </View>

          <View style={styles.informDetail}>
            <Text style={styles.detailLabel}>퀘스트 성공</Text>
            <Text style={styles.detailValue}>{previous.completed_quests?.length ?? 0}회</Text>
          </View>

          <View style={styles.informDetail}>
            <Text style={styles.detailLabel}>휴식일</Text>
            <Text style={styles.detailValue}>{previous.rest_days ?? 0}일</Text>
          </View>

        </View>

      </View>

      <View style={styles.insightBox}>
        <Text style={styles.informTitle}>완료한 퀘스트</Text>

        {completedQuests.length === 0 ? (
          <Text style={styles.emptyDescription}>완료한 퀘스트가 없어요</Text>
        ) : (
          <View style={styles.suggestList}>
            {completedQuests.map((name, i) => (
              <View key={i} style={styles.suggestRow}>
                <Text style={styles.questCheck}>✓</Text>
                <Text style={styles.suggestText}>{name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <CycleCalendar
        cycle={{ startDate: new Date(previous.started_at) }}
        logDates={previous.logDates}
        questDates={previous.questDates}
      />


        <View style={styles.activityBox}>
          <Text style={styles.informTitle}>자주 기록한 활동</Text>

          <View style={styles.chipRow}>
            {(previous.top_plus_logs ?? [])
              .filter((item) => item?.plus_log_content?.trim())
              .map((item, i) => (
              <View
                key={item.plus_log_content}
                style={[styles.chip, { backgroundColor: CHIP_COLORS[i % CHIP_COLORS.length] }]}
              >
                <Text style={styles.chipText}>{item.plus_log_content}</Text>
              </View>
            ))}
          </View>
        </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACE.screen,
    backgroundColor: COLORS.bg,
    flexGrow: 1,
  },

  nowCycleTitle: {
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingVertical: 20,
  },

  cycleBtnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },

  cycleBtnFill: {
    backgroundColor: COLORS.navigate,
    borderWidth: 1,
    borderColor: COLORS.navigate,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  cycleBtnFillText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.navigateText,
  },

  cycleBtnLine: {
    backgroundColor: COLORS.cardWhite,
    borderWidth: 1,
    borderColor: COLORS.navigate,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  cycleBtnLineText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.navigate,
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
  detailActivity: {
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
    backgroundColor: COLORS.navigate,
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

  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: SPACE.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
    marginBottom: 15,
  },

  emptyIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  emptyIcon: {
    width: 30,
    height: 30,
  },

  emptyTitle: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.text,
    marginBottom: 8,
  },

  emptyDescription: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    textAlign: 'center',
    lineHeight: 20,
  },
});
