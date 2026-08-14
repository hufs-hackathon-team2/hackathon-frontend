// QS 03 퀘스트 진행 및 완료 (3일 체크리스트, 하루 1회만 체크)
import { ScrollView, Text, View, Pressable, StyleSheet, Image} from "react-native";

export default function S52QuestProgress({ navigation, route }) {

  const title = route.params?.title ?? '퀘스트';

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageBox}>
          <Image source={require('../../../assets/questend.png')} style={styles.character} />
        </View>

        <View>
          <Text style={styles.questEndBoxText}>3일 퀘스트 완주!</Text>
          <Text style={styles.questEndBoxDes}>작은 실천이 쌓여 캐릭터가 성장했어요 🎉</Text>          
        </View>

        <View style={styles.successQuest}>
          <Text style={styles.successQuestText}>완료한 작심삼일 퀘스트</Text>
          <Text style={styles.successQuestName}>{title}</Text>
        </View>

        <View style={styles.successQuest}>
          <Text style={styles.successQuestText}>캐릭터 성장 반영</Text>

          <View style={styles.bonusRow}>

            <View style={styles.bonusBadge}>
              <Text style={styles.bonusBadgeText}>+3</Text>
            </View>

            <View style={styles.bonusInfo}>
              <Text style={styles.bonusTitle}>성장 게이지 3칸</Text>
              <Text style={styles.bonusDesc}>3일 완주 보너스가 더해졌어요</Text>
            </View>

          </View>
        </View>

        <Pressable style={styles.confirmButton} onPress={() => navigation.goBack()}>
          <Text style={styles.confirmButtonText}>확인</Text>
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

  bonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bonusBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E9F7EF',
    borderWidth: 1.5,
    borderColor: '#7EC89A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bonusBadgeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8159',
    letterSpacing: -0.5,
  },

  bonusInfo: {
    flex: 1,
  },
  bonusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E232C',
    marginBottom: 3,
  },
  bonusDesc: {
    fontSize: 13,
    color: '#8A919B',
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
})