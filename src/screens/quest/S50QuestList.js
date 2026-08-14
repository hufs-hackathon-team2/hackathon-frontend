// QS 01 AI 퀘스트 제안 (WK 01 에서 미리 생성해둔 5개, 실시간 AI 호출 없음)

import { ScrollView, Text, View, Pressable, StyleSheet, Alert, Image} from "react-native";
import { useState } from "react";
import QuestRecommend from "../../components/quest/questRecommend";
import { getDateDifference } from "../../lib/date";



const MOCK_SUGGESTIONS = [
  { id: 1, title: '아침에 일어나서 물 한 잔 마시기' },
  { id: 2, title: '하루에 30분 산책하기' },
  { id: 3, title: '자기 전 10분 스트레칭하기' },
  { id: 4, title: '10시 이후 과도한 음식 섭취 금지' },
  { id: 5, title: '헬스 1시간 하기' },
];

const MOCK_ACTIVE = {
  id: 3,
  title: '자기 전 10분 스트레칭하기',
  doneDays: 2,
  lastCheckedAt: null,
};



export default function S50QuestList({ navigation }) {

  const [activeQuest, setactiveQuest] = useState(MOCK_ACTIVE);
  const [suggestions] = useState(MOCK_SUGGESTIONS);

  const handleStart = (quest) => {
    Alert.alert('이 퀘스트를 시작할까요?', `<${quest.title}>\n3일 동안 매일 체크해보세요`, [
      { text: '취소', style: 'cancel' },
      { text: '시작', onPress: () => setactiveQuest({ ...quest, doneDays: 0 }) },
    ]);
  };
  const handleGiveUp = () => {
    Alert.alert('퀘스트를 포기할까요?', '포기한 퀘스트는 다시 되돌릴 수 없어요', [
      { text: '취소', style: 'cancel' },
      { text: '포기', style: 'destructive', onPress: () => setactiveQuest(null) },
    ]);
  };

  const checkedToday = activeQuest?.lastCheckedAt != null &&
    getDateDifference(activeQuest.lastCheckedAt, new Date()) === 0;

  
  const handleCheckToday = () => {
    const nextDays = activeQuest.doneDays + 1;

    setactiveQuest({
      ...activeQuest,
      doneDays: nextDays,
      lastCheckedAt: new Date(),
    });

    if (nextDays === 3) {
      navigation.navigate('QuestProgress', { title: activeQuest.title });
      setactiveQuest(null);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View>
        <Text style={styles.header}>작심삼일 퀘스트</Text>
      </View>

      <View>
        <Text style={styles.questTitle}>진행중인 퀘스트</Text>
        {activeQuest ? (
          <View style={styles.questbox}>

            <View style={styles.topRow}>

              <View style={{flex:1}}>
                <Text style={styles.questName}>{activeQuest.title}</Text>
                <Text style={styles.questSub}>시작한 지 {activeQuest.doneDays}일째</Text>               
              </View>
            
              <Pressable onPress={handleGiveUp} style={styles.giveUpButton}>
                <Text style={styles.giveUpText}>포기하기</Text>
              </Pressable>     

            </View>

            <View style={styles.dayRow}>
              {[1, 2, 3].map((day) => (
                <View
                  key={day}
                  style={[styles.questDay, day <= activeQuest.doneDays && styles.questDayDone]}
                >
                  {day <= activeQuest.doneDays ? (
                    <Image source={require('../../../assets/questend.png')} style={styles.stamp} />
                  ) : (
                    <Text style={styles.questDayText}>{day}</Text>
                  )}
                </View>
              ))}
            </View>

            {activeQuest.doneDays < 3 && (
              <Pressable
                style={[styles.checkButton, checkedToday && styles.checkButtonDisabled]}
                onPress={handleCheckToday}
                disabled={checkedToday}
              >
                <Text
                  style={[styles.checkButtonText, checkedToday && styles.checkButtonTextDisabled]}
                >
                  {checkedToday ? '오늘은 이미 완료했어요' : '오늘 완료하기'}
                </Text>
              </Pressable>
            )}

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

          {suggestions.length === 0 ? (
            <View style={styles.questEmptybox}>
              <Text style={styles.questEmptyText}>아직 추천 퀘스트가 없어요</Text>
              <Text style={styles.questEmptyDescription}>이번 주에 Plus log를 2개 이상 남기면 다음 주에 맞춤 퀘스트를 받을 수 있어요.</Text>
            </View>            
          ) : (
            suggestions.map((quest) =>
              <QuestRecommend
                key={quest.id}
                title={quest.title}
                disabled={activeQuest !== null}
                onStart={() => handleStart(quest)}
            />
            )         
          )}

          <Pressable style={styles.questButton} onPress={() => navigation.navigate('QuestCreate')}>
            <Text style={styles.questButtonText}>퀘스트 직접 만들기</Text>
          </Pressable>

        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  header:{
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 35,
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  questTitle:{
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 15,
  },

  questbox:{
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
  },

  questName:{
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 4,
  },

  questSub:{
    fontSize: 13,
    color: '#888',
  },

  dayRow:{
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 12,
    gap: 10,
  },

  questDay:{
    flex: 1,
    height: 70,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',      // View 로 바뀌어서 textAlign 대신
    justifyContent: 'center',
  },

  questDayText:{
    fontSize: 24,
    color: '#838383',
  },

  stamp:{
    width: 64,
    resizeMode: 'contain',
  },

  topRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },


  giveUpButton:{
    backgroundColor: '#FFF1F1',
    borderWidth: 1,
    borderColor: '#FFD4D4',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },

  giveUpText:{
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E03131',
    letterSpacing: -0.2,
  },

  questEmptybox:{
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
  },
  questEmptyDescription:{
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },

  questEmptyText:{
    fontSize: 16,
    textAlign: 'center',
    padding: 7,
  },


  questButton: {
    backgroundColor: '#2B3245',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    marginTop: 10,
  },
  questButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  questDescription:{
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  questDayDone:{
    backgroundColor: '#2B3245',
    borderColor: '#2B3245',
  },

  checkButton: {
    backgroundColor: '#2B3245',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 4,
  },
  checkButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  checkButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  checkButtonTextDisabled: {
    color: '#aaa',
  },


  
})