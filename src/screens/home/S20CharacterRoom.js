// CH 01 캐릭터 방 렌더링 + CH 03 배경 에셋 배치 (홈 탭 첫 화면)
import { ActivityIndicator, ImageBackground, ScrollView, View, Text, StyleSheet, Pressable, Image} from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCharacterStages, getCharacterSizes, getSticker, getStageIndex, getCharacterName } from '../../lib/assets';
import { getRoom } from '../../lib/api/characters';
import { getLogs } from '../../lib/api/logs';
import { getActiveQuest } from '../../lib/api/quests';
import { getDateFormat, getWeekDates } from '../../lib/date';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';




const STAGE_COLORS = ["#EBE2A2", "#C7EBA2", "#A2EBAC", "#A2EBDA", "#A2CEEB", "#A5A2EB", "#D3A2EB"];

const MAX_ASSETS = 14;


export default function S20CharacterRoom({ navigation }) {
  const insets = useSafeAreaInsets();

  const [room, setRoom] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeQuest, setActiveQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    Promise.all([getRoom(), getLogs(1), getActiveQuest()])
      .then(([character, logList, quest]) => {
        setRoom(character);
        setLogs(logList);
        setActiveQuest(quest);
      })
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
  const characterName = getCharacterName(characterType);
  const shown = room.assets.slice(-MAX_ASSETS);
  const isMax = room.gauge.current >= room.gauge.max;
  const percent = Math.round((room.gauge.current / room.gauge.max) * 100);

  const characterSize = getCharacterSizes(characterType)[stageIndex];

  const weekDates = getWeekDates();
  const loggedDates = logs.map((log) => getDateFormat(new Date(log.created_at)));
  const weekCount = weekDates.filter((date) => loggedDates.includes(date)).length;

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 5 }]}>

      <Text style={styles.header}>{characterName}의 방</Text>

      <View style={styles.roomCard}>
      <ImageBackground
        source={require('../../../assets/homebg.png')}
        style={styles.roomFill}
        resizeMode="cover"
      >

        <View style={styles.boardWrap}>

          <View style={styles.boardNail} />
          <View style={[styles.boardString, styles.boardStringLeft]} />
          <View style={[styles.boardString, styles.boardStringRight]} />

          <View style={styles.stickerSection}>
            <View style={styles.boardInner}>

              <View style={styles.stickerHeader}>
                <Text style={styles.stickerLabel}>스티커판 ⭐</Text>
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

        </View>

        <View style={styles.charactorContainer}>
          <Image
            source={getCharacterStages(characterType)[stageIndex]}
            style={characterSize}
            resizeMode="contain"
          />
        </View>

      </ImageBackground>
      </View>

      <View style={styles.growthStrip}>

        <View style={styles.growthTop}>
          <Image source={getSticker('sprout')} style={styles.growthIcon} resizeMode="contain" />
          <Text style={styles.growthLevel}>Lv.{stageIndex + 1}</Text>
          <Text style={styles.growthValue}>
            {isMax ? '성장 완료' : `${percent}%`}
          </Text>
        </View>

        <View style={styles.gaugeTrack}>
          <View
            style={[
              styles.gaugeFill,
              { width: `${percent}%`, backgroundColor: COLORS.navigate },
            ]}
          />

          <View style={styles.gaugeTicks} pointerEvents="none">
            {Array.from({ length: room.gauge.max }, (_, i) => (
              <View
                key={i}
                style={[styles.gaugeCell, i === room.gauge.max - 1 && styles.gaugeCellLast]}
              />
            ))}
          </View>
        </View>

      </View>

      <View style={styles.weekCard}>

        <View style={styles.iconBadge}>
          <Image source={getSticker('fire')} style={styles.badgeIcon} resizeMode="contain" />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekLabel}>이번 주 기록</Text>
            <Text style={styles.weekCount}>{weekCount}/7일</Text>
          </View>

          <View style={styles.weekDots}>
            {weekDates.map((date) => (
              <View
                key={date}
                style={[styles.weekDot, loggedDates.includes(date) && styles.weekDotOn]}
              />
            ))}
          </View>
        </View>

        <Pressable
          style={styles.writeButton}
          onPress={() => navigation.navigate('LogTab')}
        >
          <Text style={styles.writeButtonText}>기록하기</Text>
        </Pressable>

      </View>

      <View style={styles.weekCard}>

        <View style={styles.iconBadge}>
          <Image source={getSticker('target')} style={styles.badgeIcon} resizeMode="contain" />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekLabel}>진행 중인 퀘스트</Text>
            <Text style={styles.weekCount}>
              {activeQuest ? `${activeQuest.count}/3회` : '없어요'}
            </Text>
          </View>

          <View style={styles.weekDots}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[styles.weekDot, activeQuest && i < activeQuest.count && styles.weekDotOn]}
              />
            ))}
          </View>
        </View>

        <Pressable
          style={styles.writeButton}
          onPress={() => navigation.navigate('QuestTab')}
        >
          <Text style={styles.writeButtonText}>
            {activeQuest ? '바로가기' : '시작하기'}
          </Text>
        </Pressable>

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
    paddingBottom: 40,
    backgroundColor: COLORS.bg,
    flexGrow: 1,
  },

  header:{
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingTop: 20,
    paddingBottom: 10,
  },

  roomCard:{
    width: '100%',
    aspectRatio: 0.98,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 12,
  },

  roomFill:{
    flex: 1,
    justifyContent: 'flex-end',
    padding: SPACE.card,
  },

  charactorContainer:{
    position: 'absolute',
    left: '10%',
    bottom: '10%',
    width: '40%',
    alignItems: 'center',
  },

  charactorImage:{
    marginTop: 20,
    marginBottom: 10,
  },

  button: {
    alignSelf: 'center',
    backgroundColor: COLORS.navigate,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.navigateText,
  },

  boardWrap: {
    position: 'absolute',
    top: '4%',
    right: '4%',
    width: '52%',
    alignItems: 'center',
    paddingTop: 16,
  },

  boardNail: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#8B85A0',
  },

  boardString: {
    position: 'absolute',
    top: 6,
    width: 1.5,
    height: 24,
    backgroundColor: '#8B85A0',
  },

  boardStringLeft: {
    left: '38%',
    transform: [{ rotate: '28deg' }],
  },

  boardStringRight: {
    right: '38%',
    transform: [{ rotate: '-28deg' }],
  },

  stickerSection: {
    alignSelf: 'stretch',
    backgroundColor: '#9891AC',
    borderRadius: 10,
    padding: 6,
    shadowColor: '#1B1A18',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },

  boardInner: {
    backgroundColor: '#D8D3E4',
    borderRadius: 6,
    paddingBottom: 6,
  },

  stickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  stickerLabel: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: '#3D3750',
  },
  stickerCount: {
    fontFamily: FONT.semibold,
    fontSize: 11,
    color: '#5A5470',
  },
  stickerBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 6,
  },

  slot: {
    width: "25%",
    aspectRatio: 1,
    padding: 4,
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

  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  badgeIcon: {
    width: 20,
    height: 20,
  },

  cardBody: {
    flex: 1,
  },

  growthStrip: {
    paddingHorizontal: 4,
    marginTop: 5,
    marginBottom: 20,
  },

  growthTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  growthIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },

  growthLevel: {
    flex: 1,
    fontFamily: FONT.bold,
    fontSize: FONT.subTitle,
    color: COLORS.text,
  },

  growthValue: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.textSub,
  },

  gaugeTrack: {
    height: 10,
    backgroundColor: COLORS.cardGray,
    borderRadius: 999,
    overflow: 'hidden',
  },
  weekCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACE.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
    marginBottom: 12,
  },

  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  weekLabel: {
    flex: 1,
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.text,
  },

  weekCount: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.text,
  },

  weekDots: {
    flexDirection: 'row',
    gap: 8,
  },

  weekDot: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: COLORS.cardGray,
  },

  writeButton: {
    backgroundColor: COLORS.navigate,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginLeft: 20,
  },

  writeButtonText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.caption,
    color: COLORS.navigateText,
  },

  weekDotOn: {
    backgroundColor: COLORS.navigate,
  },

  gaugeTicks: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },

  gaugeCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },

  gaugeCellLast: {
    borderRightWidth: 0,
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
