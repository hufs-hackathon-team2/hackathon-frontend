// CY 05 재개 화면 (휴식기 이후 첫 활동 시 )
import { ScrollView, Text, View, Pressable, StyleSheet, Image } from "react-native";
import { getFullDate, getDateDifference } from "../lib/date";

const MOCK_PREVIOUS = {
  id: 1,
  startDate: new Date('2026-06-02'),
  endDate: new Date('2026-06-16'),
  logDays: 7,
  questDone: 3,
  streak: 4,
  restDays: 7,
};
const MOCK_SUGGESTIONS = [
  { id: 1, title: '아침에 일어나서 물 한 잔 마시기' },
  { id: 2, title: '하루에 30분 산책하기' },
  { id: 3, title: '자기 전 10분 스트레칭하기' },
  { id: 4, title: '10시 이후 과도한 음식 섭취 금지' },
  { id: 5, title: '헬스 1시간 하기' },
];
export default function S40Resume({ navigation, route }) {

  const previous = route.params?.previousCycle ?? MOCK_PREVIOUS;

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
          <Text style={styles.successQuestName}>{previous.id}번째 사이클</Text>

          <Text style={styles.period}>
            {getFullDate(previous.startDate)} ~ {getFullDate(previous.endDate)} · {getDateDifference(previous.startDate, previous.endDate)}일
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>PLUS Log</Text>
              <Text style={styles.summaryValue}>{previous.logDays}일</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>퀘스트</Text>
              <Text style={styles.summaryValue}>{previous.questDone}회</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>최고 연속</Text>
              <Text style={styles.summaryValue}>{previous.streak}일</Text>
            </View>
          </View>

          <Text style={styles.summaryDesc}>작은 행동들이 모여 나만의 기록이 됐어요.</Text>
        </View>

        <View style={styles.suggestHeader}>
          <Text style={styles.suggestTitle}>이번엔 이런 건 어때요?</Text>
          <Text style={styles.suggestDesc}>퀘스트 탭에서 시작할 수 있어요</Text>
        </View>

        {MOCK_SUGGESTIONS.map((quest) => (
          <View key={quest.id} style={styles.suggestItem}>
            <Text style={styles.suggestItemText}>{quest.title}</Text>
          </View>
        ))}



        <Pressable style={styles.confirmButton} onPress={() => navigation.goBack()}>
          <Text style={styles.confirmButtonText}>새 Healthy Cycle 시작하기</Text>
        </Pressable>

    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  imageBox: {
    height: 220,
    borderWidth: 1,
    borderColor: '#D9DDE3',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#FAFBFC',
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
  questEndBoxDes: {
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 20,
  },
  
  successQuest: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginVertical: 10,
  },
  successQuestText: {
    fontSize: 16,
    paddingBottom: 10,
  },
  successQuestName: {
    fontSize: 20,
    fontWeight: 'bold',
  },


  confirmButton: {
    backgroundColor: '#2B3245',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  period: {
    fontSize: 13,
    color: '#8A919B',
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
    fontSize: 13,
    color: '#8A919B',
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E232C',
  },

  summaryDesc: {
    fontSize: 13,
    color: '#8A919B',
    marginTop: 4,
  },
  suggestItem: {
    borderWidth: 1,
    borderColor: '#E8ECF4',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    backgroundColor: '#FAFBFC',
  },

  suggestItemText: {
    fontSize: 15,
    color: '#1E232C',
  },
  suggestHeader: {
    marginTop: 24,
    marginBottom: 12,
  },

  suggestTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E232C',
  },

  suggestDesc: {
    fontSize: 13,
    color: '#8A919B',
    marginTop: 4,
  },

})