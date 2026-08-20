import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { getCharacterStages, getCharacterSizes, getSticker, getStageIndex } from '../../lib/assets';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';

export const MAX_ASSETS = 14;

// 홈과 위클리 카드가 같은 방을 그린다.
// children 은 캐릭터 위에 얹는 것 (단계 상승 말풍선) 이다.
export default function CharacterRoomCard({ characterType, currentStage, assets, children }) {

  const stageIndex = getStageIndex(currentStage);
  const shown = assets?.slice(-MAX_ASSETS) ?? [];
  const characterSize = getCharacterSizes(characterType)[stageIndex];

  return (
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
          {children}

          <Image
            source={getCharacterStages(characterType)[stageIndex]}
            style={characterSize}
            resizeMode="contain"
          />
        </View>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  roomCard: {
    width: '100%',
    aspectRatio: 0.98,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 12,
  },

  roomFill: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: SPACE.card,
  },

  charactorContainer: {
    position: 'absolute',
    left: '10%',
    bottom: '10%',
    width: '40%',
    alignItems: 'center',
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
    justifyContent: 'center',
    paddingHorizontal: 6,
  },

  slot: {
    width: '25%',
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
});
