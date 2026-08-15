// CH 01 캐릭터 방 렌더링 + CH 03 배경 에셋 배치 (홈 탭 첫 화면)
import { ScrollView, View, Text, StyleSheet, Pressable} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  header:{
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    paddingVertical: 10,
  },
  
  charactorBox:{
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    padding: 20,
    marginTop: 20,
  },
  charactorContainer:{
    alignItems: 'center',
    marginBottom: 20,
  },
  charactorImage:{
    fontSize: 200,
    marginTop: 20,
    marginBottom: 10,
  },

  charactorInfoBox:{
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    padding: 10,
  },
  charactorLevel:{
    fontSize: 16,
    color: '#666',
    margin:3,
  },
  charactorName:{
    fontSize: 18,
    fontWeight: 'bold',
    margin:3,
    
  },
  
  button: {
    backgroundColor: '#F7F7F8',
    borderWidth: 1,
    borderColor: '#E0E0E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
  },

  stickerSection: {
    alignSelf: 'stretch',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    paddingBottom: 5,
  },
  stickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  stickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  stickerCount: {
    fontSize: 12,
    color: '#999',
  },
  stickerBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },

  slot: {
    width: "14.28%",
    aspectRatio: 1,
    padding: 3,
  },
  slotInner: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotEmoji: {
    fontSize: 18,
    includeFontPadding: false,
  },

  gaugeCard: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2dfdf',
    borderRadius: 8,
  },
  gaugeLabel: {
    fontSize: 13,
    marginBottom: 10,
    fontWeight: '600',
    color: '#555',
  },
  gaugeTrack: {
    height: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2dfdf',
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: '#7ec89a',
  },
});



const STAGES = ["레벨 1", "레벨 2", "레벨 3", "레벨 4", "레벨 5", "레벨 6", "레벨 7"];
const STAGE_COLORS = ["#EBE2A2", "#C7EBA2", "#A2EBAC", "#A2EBDA", "#A2CEEB", "#A5A2EB", "#D3A2EB"];
const GOALS = [5,6,7,8,9,10];

function getGrowth(totalPoints) {
  let remaining = totalPoints;

  for (let i = 0; i < GOALS.length; i++) {
    if (remaining < GOALS[i]) {
      return { stage: STAGES[i], filled: remaining, goal: GOALS[i], isMax: false };
    }
    remaining -= GOALS[i];
  }

  return { stage: STAGES[6], filled: 0, goal: 0, isMax: true };
}


const MAX_ASSETS = 14;
const assets = ['🐾', '💧', '🧘', '🐾'];
const shown = assets.slice(-MAX_ASSETS);
const totalPoints = 8;
const growth = getGrowth(totalPoints);
const percent = growth.isMax ? 100 : (growth.filled / growth.goal) * 100;


export default function S20CharacterRoom({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 5 }]}>

      <View >
        <Text style={styles.header}>HOME</Text>
      </View>

      <View style={styles.charactorBox}>

        <View style={styles.charactorContainer}>
          <Text style={styles.charactorImage}>🐈</Text>
        </View>

        <View style={styles.stickerSection}>
          <View style={styles.stickerHeader}>
            <Text style={styles.stickerLabel}>⭐ 애옹이의 이번 사이클 스티커판</Text>
            <Text style={styles.stickerCount}>{shown.length}/{MAX_ASSETS}</Text>
          </View>

          <View style={styles.stickerBar}>
            {Array.from({ length: MAX_ASSETS }, (_, i) => (
              <View key={i} style={styles.slot}>
                <View style={styles.slotInner}>
                  <Text style={styles.slotEmoji}>{shown[i] ?? ''}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </View>

      <View style={styles.charactorInfoBox}>
          <Text style={styles.charactorName}>애옹이</Text>
          <Text style={styles.charactorLevel}>{growth.stage}</Text>
      </View>

      <View style={styles.gaugeCard}>

        <Text style={styles.gaugeLabel}>
          {growth.isMax ? '성장 완료' : `성장 게이지 ${growth.filled}/${growth.goal}`}
        </Text>
        
        <View style = {styles.gaugeTrack}>
          <View 
          style={[styles.gaugeFill, 
          { width: `${percent}%`, 
          backgroundColor: STAGE_COLORS[STAGES.indexOf(growth.stage)] }]} />        
        </View>

      </View>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Weekly')}
      >
        <Text style={styles.buttonText}>이번 주 위클리 카드 보기</Text>
      </Pressable>

    </ScrollView>


  );
}
