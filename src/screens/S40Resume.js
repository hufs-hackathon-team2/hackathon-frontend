// CY 05 재개 화면 (휴식기 이후 첫 활동 시 )
import { ActivityIndicator, ScrollView, Text, View, Pressable, StyleSheet, Image } from "react-native";
import { useState, useEffect } from 'react';
import { getFullDate, getDateDifference } from "../lib/date";
import { COLORS, FONT, SPACE, RADIUS } from '../lib/theme';
import { getPreviousAnalysis } from '../lib/api/cycles';
import { getRecommendations } from '../lib/api/quests';

export default function S40Resume({ navigation }) {

  const [previous, setPrevious] = useState(null);
  const [recommend, setRecommend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([getPreviousAnalysis(), getRecommendations()])
      .then(([cycle, rec]) => {
        setPrevious(cycle);
        setRecommend(rec);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !previous) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>사이클 정보를 불러오지 못했어요</Text>
      </View>
    );
  }

  const startDate = new Date(previous.started_at);
  const endDate = new Date(previous.closed_at);

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageBox}>
          <Image source={require('../../assets/questend.png')} style={styles.character} />
        </View>

        <View>
          <Text style={styles.questEndBoxText}>다시 돌아오셨네요 😊</Text>
          <Text style={styles.questEndBoxDes}>잠깐 쉬었을 뿐이에요. 이전에 쌓아 온 기록이 여기 있어요.</Text>
        </View>

        <View style={styles.successQuest}>
          <Text style={styles.successQuestText}>지난 Healthy Cycle 돌아보기</Text>
          <Text style={styles.successQuestName}>{previous.cycle_count}번째 사이클</Text>

          <Text style={styles.period}>
            {getFullDate(startDate)} ~ {getFullDate(endDate)} · {getDateDifference(startDate, endDate)}일
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>PLUS Log</Text>
              <Text style={styles.summaryValue}>{previous.active_days}일</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>퀘스트</Text>
              <Text style={styles.summaryValue}>{previous.completed_quests.length}회</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>휴식일</Text>
              <Text style={styles.summaryValue}>{previous.rest_days}일</Text>
            </View>
          </View>

          <Text style={styles.summaryDesc}>작은 행동들이 모여 나만의 기록이 됐어요.</Text>
        </View>

        <View style={styles.suggestHeader}>
          <Text style={styles.suggestTitle}>이번엔 이런 건 어때요?</Text>
          <Text style={styles.suggestDesc}>퀘스트 탭에서 시작할 수 있어요</Text>
        </View>

        {recommend?.has_recommendations ? (
          recommend.recommended_quests.map((quest) => (
            <View key={quest.recommendation_id} style={styles.suggestItem}>
              <Text style={styles.suggestItemText}>{quest.quest_content}</Text>
            </View>
          ))
        ) : (
          <View style={styles.suggestItem}>
            <Text style={styles.suggestItemText}>아직 추천 퀘스트가 없어요</Text>
          </View>
        )}

        <Pressable style={styles.confirmButton} onPress={() => navigation.goBack()}>
          <Text style={styles.confirmButtonText}>새 Healthy Cycle 시작하기</Text>
        </Pressable>

    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    padding: SPACE.screen,
    backgroundColor: COLORS.bg,
    flexGrow: 1,
  },

  imageBox: {
    height: 220,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  character: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },

  questEndBoxText: {
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    textAlign: 'center',
    paddingVertical: 10,
  },
  questEndBoxDes: {
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.textSub,
    textAlign: 'center',
    paddingBottom: 20,
  },

  successQuest: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
    padding: SPACE.card,
    marginVertical: 10,
  },
  successQuestText: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    paddingBottom: 6,
  },
  successQuestName: {
    fontFamily: FONT.semibold,
    fontSize: FONT.cardTitle,
    color: COLORS.text,
  },


  confirmButton: {
    backgroundColor: COLORS.navigate,
    borderRadius: RADIUS.button,
    paddingVertical: 15,
    marginTop: 20,
  },
  confirmButtonText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.navigateText,
    textAlign: 'center',
  },
  period: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginTop: 4,
  },

  summaryRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 12,
    gap: 10,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
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

  summaryDesc: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginTop: 4,
  },
  suggestItem: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    backgroundColor: COLORS.cardWhite,
  },

  suggestItemText: {
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.text,
  },
  suggestHeader: {
    marginTop: 24,
    marginBottom: 12,
  },

  suggestTitle: {
    fontFamily: FONT.semibold,
    fontSize: FONT.cardTitle,
    color: COLORS.text,
  },

  suggestDesc: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginTop: 4,
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
})
