// QS 03 퀘스트 진행 및 완료 (3일 체크리스트, 하루 1회만 체크)
import { ScrollView, Text, View, Pressable, StyleSheet, Image} from "react-native";
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';
import { CAT_STAGES } from '../../lib/assets';

export default function S52QuestProgress({ navigation, route }) {

  const title = route.params?.title ?? '퀘스트';

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageBox}>
          <Image source={CAT_STAGES[3]} style={styles.character} />
        </View>

        <View>
          <Text style={styles.questEndBoxText}>3일 퀘스트 완주!</Text>
          <Text style={styles.questEndBoxDes}>작은 실천이 쌓여 캐릭터가 성장했어요 🎉</Text>          
        </View>

        <View style={styles.successQuest}>
          <Text style={styles.successQuestText}>완료한 퀘스트</Text>
          <Text style={styles.successQuestName}>{title}</Text>
        </View>

        <View style={styles.successQuest}>
          <Text style={styles.sectionLabel}>캐릭터 성장 반영</Text>

          <View style={styles.bonusRow}>

            <View style={styles.bonusBadge}>
              <Text style={styles.bonusBadgeText}>+3</Text>
            </View>

            <View style={styles.bonusInfo}>
              <Text style={styles.bonusTitle}>성장 게이지 3칸</Text>
              <Text style={styles.bonusDesc}>퀘스트 완료 보너스가 반영되었어요</Text>
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
    paddingHorizontal: SPACE.screen,
    paddingVertical: SPACE.screen,
    backgroundColor: COLORS.bg,
    flexGrow: 1,
  },

  imageBox: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  character: {
    width: 120,
    height: 120,
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
    fontSize: FONT.body,
    color: COLORS.textSub,
    textAlign: 'center',
    paddingBottom: 20,
  },

  successQuest: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    marginBottom: 10,
    backgroundColor: COLORS.cardWhite,
  },

  successQuestText: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    textAlign: 'center',
    paddingBottom: 6,
  },

  successQuestName: {
    fontFamily: FONT.semibold,
    fontSize: FONT.cardTitle,
    color: COLORS.navigate,
    textAlign: 'center',
  },

  sectionLabel: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    paddingBottom: 6,
  },

  bonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  bonusBadge: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: COLORS.lavender,
    borderWidth: 1.5,
    borderColor: COLORS.navigate,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  bonusBadgeText: {
    fontFamily: FONT.bold,
    fontSize: FONT.subbody,
    color: COLORS.navigate,
  },

  bonusInfo: {
    flex: 1,
  },

  bonusTitle: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.text,
    marginBottom: 3,
  },

  bonusDesc: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
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
})
