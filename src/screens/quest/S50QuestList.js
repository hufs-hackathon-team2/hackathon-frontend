// QS 01 AI 퀘스트 제안 (WK 01 에서 미리 생성해둔 5개, 실시간 AI 호출 없음)

import { ActivityIndicator, ScrollView, Text, View, Pressable, StyleSheet, Alert } from "react-native";
import { useState, useEffect } from "react";
import QuestRecommend from "../../components/quest/questRecommend";
import { getDateFormat } from "../../lib/date";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';
import {
  getActiveQuest,
  getRecommendations,
  startQuest,
  checkQuest,
  abandonQuest,
} from '../../lib/api/quests';



export default function S50QuestList({ navigation }) {

  const insets = useSafeAreaInsets();

  const [activeQuest, setactiveQuest] = useState(null);
  const [recommend, setRecommend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    Promise.all([getActiveQuest(), getRecommendations()])
      .then(([quest, rec]) => {
        setactiveQuest(quest);
        setRecommend(rec);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();

    // 다른 화면에서 퀘스트를 시작하고 돌아왔을 때 다시 받아온다
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  const handleStart = (quest) => {
    Alert.alert('이 퀘스트를 시작할까요?', `<${quest.quest_content}>7일 안에 3일만 체크하면 성공!`, [
      { text: '취소', style: 'cancel' },
      {
        text: '시작',
        onPress: () => {
          startQuest(quest.quest_content)
            .then((res) => {
              if (res.new_cycle_started) {
                navigation.navigate('Resume');
                return;
              }

              load();
            })
            .catch(() => Alert.alert('시작하지 못했어요', '이미 진행 중인 퀘스트가 있어요'));

        },
      },
    ]);
  };

  const handleGiveUp = () => {
    Alert.alert('퀘스트를 포기할까요?', '포기한 퀘스트는 다시 되돌릴 수 없어요', [
      { text: '취소', style: 'cancel' },
      {
        text: '포기',
        style: 'destructive',
        onPress: () => {
          abandonQuest(activeQuest.quest_id)
            .then(load)
            .catch(() => Alert.alert('포기하지 못했어요', '잠시 후 다시 시도해주세요'));
        },
      },
    ]);
  };

  // 오늘 이미 체크했는지는 서버가 준 last_checked 로 판단한다.
  // 화면 state 로 두면 앱을 껐다 켤 때 초기화돼서 하루 두 번 체크할 수 있다.
  const checkedToday = activeQuest?.last_checked === getDateFormat(new Date());

  const handleCheckToday = () => {
    checkQuest(activeQuest.quest_id)
      .then((res) => {
        if (res.is_success) {
          navigation.navigate('QuestProgress', { title: activeQuest.quest_content });
        }

        load();
      })
      .catch(() => Alert.alert('완료하지 못했어요', '잠시 후 다시 시도해주세요'));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !recommend) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>퀘스트를 불러오지 못했어요</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 5 }]}>


      <View>
        <Text style={styles.questTitle}>진행중인 퀘스트</Text>
        {activeQuest ? (
          <View>
            <Text style={styles.questDescription}>7일 안에 3번, 하루씩 띄어도 괜찮아요</Text>

            <View style={styles.questbox}>

              <Text style={styles.questName}>{activeQuest.quest_content}</Text>
              <Text style={styles.questSub}>
                시작한 지 {activeQuest.days_since_start}일째 · D-{activeQuest.d_day}
              </Text>

              <View style={styles.dayRow}>
                {[1, 2, 3].map((day) => {
                  const done = day <= activeQuest.count;
                  const isNext = day === activeQuest.count + 1;

                  return (
                    <View
                      key={day}
                      style={[
                        styles.questDay,
                        isNext && styles.questDayNext,
                        done && styles.questDayDone,
                      ]}
                    >
                      {done ? (
                        <View style={styles.doneMark}>
                          <Text style={styles.questCheck}>✓</Text>
                          <Text style={[styles.questDayText, styles.questDayTextActive]}>
                            {day}회차
                          </Text>
                        </View>
                      ) : (
                        <Text
                          style={[
                            styles.questDayText,
                            isNext && styles.questDayTextActive,
                          ]}
                        >
                          {day}회차
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>

              {activeQuest.count < 3 && (
                <Pressable
                  style={[styles.checkButton, checkedToday && styles.checkButtonDisabled]}
                  onPress={handleCheckToday}
                  disabled={checkedToday}
                >
                  <Text
                    style={[styles.checkButtonText, checkedToday && styles.checkButtonTextDisabled]}
                  >
                    {checkedToday ? '오늘은 완료' : '완료'}
                  </Text>
                </Pressable>
              )}

            </View>

            <Pressable onPress={handleGiveUp} style={styles.giveUpButton}>
              <Text style={styles.giveUpText}>포기하기</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <Text style={styles.questEmptyText}>진행 중인 퀘스트가 없어요</Text>
          </View>

        )}


        <View>
          <Text style={styles.questTitle}>이번 주 맞춤 추천 퀘스트</Text>

          {activeQuest && (
            <Text style={styles.questDescription}>진행 중인 퀘스트를 마치면 새 퀘스트를 시작할 수 있어요</Text>
          )}

          {!recommend.has_recommendations ? (
            <View style={styles.questEmptybox}>
              <Text style={styles.questEmptyText}>아직 추천 퀘스트가 없어요</Text>
              <Text style={styles.questEmptyDescription}>이번 주에 PLUS Log 를 2개 이상 남기면 다음 주에 맞춤 퀘스트를 받을 수 있어요.</Text>
            </View>            
          ) : (
            recommend.recommended_quests.map((quest) => (
              <QuestRecommend
                key={quest.recommendation_id}
                title={quest.quest_content}
                reason={quest.reason}
                disabled={activeQuest !== null}
                onStart={() => handleStart(quest)}
              />
            ))
          )}

          <Text style={styles.createGuide}>원하는 행동이 없다면 직접 만들어보세요</Text>

          <Pressable
            style={[styles.questButton, activeQuest !== null && styles.questButtonDisabled]}
            onPress={() => navigation.navigate('QuestCreate')}
            disabled={activeQuest !== null}
          >
            <Text style={[styles.questButtonText, activeQuest !== null && styles.questButtonTextDisabled]}>
              직접 만들기
            </Text>
          </Pressable>

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

  questTitle:{
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingTop: 20,
    paddingBottom: 15,
  },

  questbox:{
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    backgroundColor: COLORS.cardWhite,
  },

  questName:{
    fontFamily: FONT.semibold,
    fontSize: FONT.cardTitle,
    color: COLORS.text,
    paddingVertical: 4,
  },

  questSub:{
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    paddingBottom: 4,
  },

  dayRow:{
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
    marginBottom: 16,
  },

  questDay:{
    width: 64,
    height: 64,
    borderRadius: 999,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  questDayNext:{
    borderColor: COLORS.primary,
  },

  questDayDone:{
    borderStyle: 'solid',
    borderColor: COLORS.primary,
    backgroundColor: COLORS.chip2,
  },

  doneMark:{
    alignItems: 'center',
    transform: [{ rotate: '-15deg' }],
  },

  questCheck:{
    fontFamily: FONT.semibold,
    fontSize: FONT.caption,
    color: COLORS.primary,
  },

  questDayText:{
    fontFamily: FONT.regular,
    fontSize: 11,
    color: COLORS.textSub,
  },

  questDayTextActive:{
    fontFamily: FONT.semibold,
    color: COLORS.primary,
  },

  topRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  giveUpButton:{
    alignSelf: 'flex-end',
    backgroundColor: COLORS.danger,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },

  giveUpText:{
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.dangerText,
    textAlign: 'center',
  },

  questEmptybox:{
    marginBottom: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    backgroundColor: COLORS.cardWhite,
  },

  questEmptyText:{
    fontFamily: FONT.regular,
    fontSize: FONT.body,
    color: COLORS.text,
    textAlign: 'center',
    padding: 7,
  },

  questEmptyDescription:{
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    textAlign: 'center',
    lineHeight: 20,
  },

  questDescription:{
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginBottom: 15,
  },

  questButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.navigate,
    borderRadius: RADIUS.button,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 18,
    marginBottom: 20,
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

  createGuide: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    textAlign: 'center',
    marginTop: 16,
  },

  questButtonText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.navigateText,
    textAlign: 'center',
  },

  questButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },

  questButtonTextDisabled: {
    color: COLORS.disabledText,
  },

  checkButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginTop: 4,
  },

  checkButtonText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.primaryText,
    textAlign: 'center',
  },

  checkButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },

  checkButtonTextDisabled: {
    color: COLORS.disabledText,
  },
});
