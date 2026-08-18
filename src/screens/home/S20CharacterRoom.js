// CH 01 캐릭터 방 렌더링 + CH 03 배경 에셋 배치 (홈 탭 첫 화면)
import { ActivityIndicator, ScrollView, View, Text, StyleSheet, Pressable, Image} from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCharacterStages, getCharacterSizes, getSticker, getStageIndex } from '../../lib/assets';
import { getRoom } from '../../lib/api/characters';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';




const STAGE_COLORS = ["#EBE2A2", "#C7EBA2", "#A2EBAC", "#A2EBDA", "#A2CEEB", "#A5A2EB", "#D3A2EB"];



const MAX_ASSETS = 14;


export default function S20CharacterRoom({ navigation }) {
  const insets = useSafeAreaInsets();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    getRoom()
      .then(setRoom)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();

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

  if (error || !room) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>캐릭터 정보를 불러오지 못했어요</Text>
      </View>
    );
  }

  const stageIndex = getStageIndex(room.current_stage);
  const characterType = room.character_type;
  const shown = room.assets.slice(-MAX_ASSETS);
  const isMax = room.gauge.current >= room.gauge.max;
  const percent = Math.round((room.gauge.current / room.gauge.max) * 100);

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 5 }]}>

      <View >
        <Text style={styles.header}>HOME</Text>
      </View>

      <View style={styles.charactorBox}>

        <View style={styles.charactorContainer}>
          <Image
            source={getCharacterStages(characterType)[stageIndex]}
            style={getCharacterSizes(characterType)[stageIndex]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.stickerSection}>
          <View style={styles.stickerHeader}>
            <Text style={styles.stickerLabel}>⭐ 이번 사이클 스티커판</Text>
            <Text style={styles.stickerCount}>{shown.length}/{MAX_ASSETS}</Text>
          </View>

          <View style={styles.stickerBar}>
            {Array.from({ length: MAX_ASSETS }, (_, i) => (
              <View key={i} style={styles.slot}>
                <View style={styles.slotInner}>
                  {shown[i] ? (
                    <Image source={getSticker(shown[i])} style={styles.slotImage} resizeMode="contain" />
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </View>

      </View>

      <View style={styles.charactorInfoBox}>
          <Text style={styles.charactorName}>애옹이</Text>
          <Text style={styles.charactorLevel}>{stageIndex + 1}단계</Text>
      </View>

      <View style={styles.gaugeCard}>

        <View style={styles.gaugeHeader}>
          <Text style={styles.gaugeLabel}>
            {isMax ? '성장 완료' : '성장 게이지'}
          </Text>
          <Text style={styles.gaugePercent}>{percent}%</Text>
        </View>

        <View style = {styles.gaugeTrack}>
          <View
          style={[styles.gaugeFill,
          { width: `${percent}%` }]} />
        </View>

      </View>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Weekly')}
      >
        <Text style={styles.buttonText}>위클리 카드 보기</Text>
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

  header:{
    textAlign: 'center',
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingVertical: 10,
  },

  charactorBox:{
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
    padding: SPACE.card,
    marginTop: 20,
  },
  charactorContainer:{
    height: 240,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  charactorImage:{
    marginTop: 20,
    marginBottom: 10,
  },

  charactorInfoBox:{
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  charactorLevel:{
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.textSub,
  },
  charactorName:{
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    marginBottom: 4,
  },

  button: {
    alignSelf: 'center',
    backgroundColor: COLORS.navigate,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.navigateText,
  },

  stickerSection: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.cardAlt,
    borderRadius: RADIUS.card,
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
    borderBottomColor: COLORS.border,
  },
  stickerLabel: {
    fontFamily: FONT.semibold,
    fontSize: FONT.caption,
    color: COLORS.text,
  },
  stickerCount: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
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
    backgroundColor: COLORS.cardGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotImage: {
    width: '78%',
    height: '78%',
  },
  gaugeCard: {
    marginTop: 20,
    padding: SPACE.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  gaugeLabel: {
    fontFamily: FONT.semibold,
    fontSize: FONT.caption,
    color: COLORS.text,
  },
  gaugePercent: {
    fontFamily: FONT.semibold,
    fontSize: FONT.caption,
    color: COLORS.text,
  },
  gaugeTrack: {
    height: 12,
    backgroundColor: COLORS.cardGray,
    borderRadius: 999,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.navigate,
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

});
