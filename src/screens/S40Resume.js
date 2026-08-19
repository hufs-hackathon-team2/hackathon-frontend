// CY 05 재개 화면 (휴식기 이후 첫 활동 시 )
import { ActivityIndicator, ScrollView, Text, View, Pressable, StyleSheet, Image } from "react-native";
import { useState, useEffect } from 'react';
import { getFullDate, getDateDifference } from "../lib/date";
import { COLORS, FONT, SPACE, RADIUS } from '../lib/theme';
import { getPreviousAnalysis } from '../lib/api/cycles';
import { getRecommendations } from '../lib/api/quests';
import { getRoom } from '../lib/api/characters';
import { getCharacterStages, getCharacterSizes, getStageIndex } from '../lib/assets';

export default function S40Resume({ navigation }) {

  const [previous, setPrevious] = useState(null);
  const [recommend, setRecommend] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([getPreviousAnalysis(), getRecommendations(), getRoom()])
      .then(([cycle, rec, character]) => {
        setPrevious(cycle);
        setRecommend(rec);
        setRoom(character);
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

  const stageIndex = getStageIndex(room?.current_stage);
  const characterImage = getCharacterStages(room?.character_type)[stageIndex];
  const characterSize = getCharacterSizes(room?.character_type)[stageIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageBox}>
          <Image source={characterImage} style={characterSize} resizeMode="contain" />
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
              <Text style={styles.summaryValue}>{previous.completed_quests?.length ?? 0}회</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>휴식일</Text>
              <Text style={styles.summaryValue}>{previous.rest_days}일</Text>
            </View>
          </View>

        </View>

        <View style={styles.suggestHeader}>
          <Text style={styles.suggestTitle}>이번엔 이런 건 어때요?</Text>
          <Text style={styles.suggestDesc}>퀘스트 탭에서 시작할 수 있어요</Text>
        </View>

        {recommend?.has_recommendations ? (
          recommend.recommended_quests?.map((quest) => (
            <View key={quest.recommendation_id} style={styles.suggestItem}>
              <Text style={styles.suggestItemText}>{quest.quest_content}</Text>
              <Text style={styles.suggestItemReason}>{quest.reason}</Text>
            </View>
          ))
        ) : (
          <View style={styles.suggestItem}>
            <Text style={styles.suggestItemText}>아직 추천 퀘스트가 없어요</Text>
          </View>
        )}

        <Pressable style={styles.confirmButton} onPress={() => navigation.popTo('Main')}>
          <Text style={styles.confirmButtonText}>새 Healthy Cycle 시작하기</Text>
        </Pressable>

    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    padding: SPACE.screen,
    paddingBottom: 60,
    backgroundColor: COLORS.bg,
    flexGrow: 1,
  },

  imageBox: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
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
    marginLeft: 1,
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
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.text,
    marginBottom: 4,
  },

  suggestItemReason: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
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
