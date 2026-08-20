
import { ActivityIndicator, ImageBackground, ScrollView, View, Text, StyleSheet, Pressable, Image} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getSticker, getStageIndex, getCharacterName } from '../../lib/assets';
import { getRoom } from '../../lib/api/characters';
import { getLogs } from '../../lib/api/logs';
import { getActiveQuest } from '../../lib/api/quests';
import { getSavedCharacterName } from '../../lib/api/token';
import { getDateFormat, getWeekDates } from '../../lib/date';
import CharacterRoomCard from '../../components/home/CharacterRoomCard';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';

export default function S20CharacterRoom({ navigation }) {
  const insets = useSafeAreaInsets();

  const [room, setRoom] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeQuest, setActiveQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [savedName, setSavedName] = useState(null);
  const [shownComplete, setShownComplete] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const prevStage = useRef(null);

  const load = () => {
    getSavedCharacterName().then(setSavedName);

    Promise.allSettled([getRoom(), getLogs(1), getActiveQuest()])
      .then(([roomRes, logRes, questRes]) => {
        const character = roomRes.status === 'fulfilled' ? roomRes.value : null;

        setRoom(character);
        setLogs(logRes.status === 'fulfilled' ? logRes.value ?? [] : []);
        setActiveQuest(questRes.status === 'fulfilled' ? questRes.value : null);

        setError(roomRes.status === 'rejected');

        const index = getStageIndex(character?.current_stage);
        if (
          prevStage.current !== null &&
          index > prevStage.current &&
          !character?.is_completed
        ) {
          setLevelUp(true);
        }
        prevStage.current = index;

        if (character?.is_completed && !shownComplete) {
          setShownComplete(true);
          navigation.navigate('CharacterComplete', { room: character });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();

    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!levelUp) return;

    const timer = setTimeout(() => setLevelUp(false), 2500);
    return () => clearTimeout(timer);
  }, [levelUp]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const stageIndex = getStageIndex(room?.current_stage);
  const characterType = room?.character_type;

  const characterName =
    room?.character_name ?? savedName ?? getCharacterName(characterType);

  const gauge = room?.gauge ?? { current: 0, max: 8 };
  const isMax = gauge.current >= gauge.max;
  const percent = Math.round((gauge.current / gauge.max) * 100);

  const weekDates = getWeekDates();
  const loggedDates = logs.map((log) => getDateFormat(new Date(log.created_at)));
  const weekCount = weekDates.filter((date) => loggedDates.includes(date)).length;
  const today = getDateFormat(new Date());

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 5 }]}>

      <View style={styles.headerRow}>
        <Text style={styles.header}>{room ? `${characterName}의 방` : '내 방'}</Text>

        <Pressable
          style={styles.albumButton}
          onPress={() => navigation.navigate('CharacterArchive')}
        >
          <Image source={getSticker('star')} style={styles.albumIcon} resizeMode="contain" />
          <Text style={styles.albumText}>앨범</Text>
        </Pressable>
      </View>

      {!room && (
        <View style={styles.roomFallback}>
          <Text style={styles.errorText}>캐릭터 정보를 불러오지 못했어요</Text>
        </View>
      )}

      {room && (
        <CharacterRoomCard
          characterType={characterType}
          currentStage={room.current_stage}
          assets={room.assets}
        >
          {levelUp && (
            <View style={styles.bubbleWrap}>
              <View style={styles.bubble}>
                <Text style={styles.bubbleText}>축하해요! 한 단계 자랐어요 🎉</Text>
              </View>
              <View style={styles.bubbleTail} />
            </View>
          )}
        </CharacterRoomCard>
      )}

      {room && (
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
            {Array.from({ length: gauge.max }, (_, i) => (
              <View
                key={i}
                style={[styles.gaugeCell, i === gauge.max - 1 && styles.gaugeCellLast]}
              />
            ))}
          </View>
        </View>

      </View>
      )}

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
                style={[
                  styles.weekDot,
                  date < today && styles.weekDotMissed,
                  date === today && styles.weekDotIdle,
                  loggedDates.includes(date) && styles.weekDotOn,
                  date === today && styles.weekDotToday,
                ]}
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
                style={[
                  styles.weekDot,
                  styles.weekDotIdle,
                  activeQuest && i < activeQuest.count && styles.weekDotOn,
                  activeQuest && i === activeQuest.count && styles.weekDotToday,
                ]}
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

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  header:{
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingTop: 20,
    paddingBottom: 10,
  },

  albumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.cardWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },

  albumIcon: {
    width: 16,
    height: 16,
  },

  albumText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.caption,
    color: COLORS.text,
  },

  bubbleWrap: {
    alignItems: 'center',
    marginBottom: 6,
  },

  bubble: {
    backgroundColor: COLORS.chip1,
    borderWidth: 1.5,
    borderColor: COLORS.navigate,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  bubbleTail: {
    width: 12,
    height: 12,
    marginTop: -7,
    backgroundColor: COLORS.chip1,
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: COLORS.navigate,
    transform: [{ rotate: '45deg' }],
  },

  bubbleText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.caption,
    color: COLORS.text,
    textAlign: 'center',
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
  roomFallback: {
    paddingVertical: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
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

  weekDotMissed: {
    backgroundColor: COLORS.dotOff,
  },

  weekDotIdle: {
    backgroundColor: COLORS.cardGray,
  },

  weekDotToday: {
    borderWidth: 1.5,
    borderColor: COLORS.navigate,
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
