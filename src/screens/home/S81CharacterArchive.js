import { useState, useEffect } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../../components/common/ScreenHeader';
import { getCharacterStages, getSticker } from '../../lib/assets';
import { getFullDate } from '../../lib/date';
import { getArchive } from '../../lib/api/characters';
import { getErrorMessage } from '../../lib/api/error';
import { COLORS, FONT, SPACE, RADIUS, PRESSED } from '../../lib/theme';

const LAST_STAGE = 6;

export default function S81CharacterArchive({ navigation }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const load = () => {
    setErrorMessage('');

    getArchive()
      .then((list) => setCharacters(list ?? []))
      .catch((error) => setErrorMessage(getErrorMessage(error, '앨범을 불러오지 못했어요')))
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

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.titleRow}>
          <Text style={styles.title}>내가 키운 캐릭터</Text>
          <Text style={styles.count}>{characters.length}마리</Text>
        </View>

        <Text style={styles.description}>45칸을 다 채운 캐릭터가 모여요</Text>

        {errorMessage ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>{errorMessage}</Text>

            <Pressable style={({ pressed }) => [styles.retryButton, pressed && PRESSED]} onPress={load}>
              <Text style={styles.retryText}>다시 시도</Text>
            </Pressable>
          </View>
        ) : characters.length === 0 ? (
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconBadge}>
              <Image source={getSticker('sprout')} style={styles.emptyIcon} resizeMode="contain" />
            </View>

            <Text style={styles.emptyTitle}>아직 완성한 캐릭터가 없어요</Text>

            <Text style={styles.emptyDescription}>
              첫 캐릭터를 45칸까지 키워보세요{'\n'}
              다 자라면 여기에 보관됩니다
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {characters.map((character) => (
              <View key={character.character_id} style={styles.card}>
                <View style={styles.imageBox}>
                  <Image
                    source={getCharacterStages(character.character_type)[LAST_STAGE]}
                    style={styles.characterImage}
                    resizeMode="contain"
                  />
                </View>

                <Text style={styles.name} numberOfLines={1}>
                  {character.character_name}
                </Text>

                <Text style={styles.date}>{getFullDate(character.completed_at)}</Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  container: {
    paddingHorizontal: SPACE.screen,
    paddingBottom: 40,
    backgroundColor: COLORS.bg,
    flexGrow: 1,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },

  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
  },

  count: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.navigate,
  },

  description: {
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.textSub,
    marginTop: 6,
    marginBottom: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  card: {
    width: '33.33%',
    padding: 5,
    alignItems: 'center',
  },

  imageBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.cardWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },

  characterImage: {
    width: '80%',
    height: '80%',
  },

  name: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.text,
    marginTop: 8,
  },

  date: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginTop: 2,
  },

  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: SPACE.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
  },

  emptyIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  emptyIcon: {
    width: 30,
    height: 30,
  },

  emptyTitle: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyDescription: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    textAlign: 'center',
    lineHeight: 20,
  },

  retryButton: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.button,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 8,
  },

  retryText: {
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.textSub,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACE.screen,
    backgroundColor: COLORS.bg,
  },
});
