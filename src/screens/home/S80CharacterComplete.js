import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getCharacterStages } from '../../lib/assets';
import { getFullDate, getDurationDays, EMPTY_DATE } from '../../lib/date';
import { archiveCharacter } from '../../lib/api/characters';
import { getErrorMessage } from '../../lib/api/error';
import { COLORS, FONT, SPACE, RADIUS, PRESSED } from '../../lib/theme';

const LAST_STAGE = 6;

export default function S80CharacterComplete({ navigation, route }) {
  const room = route.params?.room ?? {};
  const [saving, setSaving] = useState(false);

  const name = room.character_name ?? '캐릭터';
  const days = getDurationDays(room.started_at, room.completed_at);

  const handleArchive = () => {
    setSaving(true);

    archiveCharacter()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'CharacterSelect', params: { renew: true } }],
        });
      })
      .catch((error) => {
        Alert.alert('보관하지 못했어요', getErrorMessage(error));
        setSaving(false);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.imageBox}>
        <Image
          source={getCharacterStages(room.character_type)[LAST_STAGE]}
          style={styles.character}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>{name}가 다 자랐어요!</Text>
      <Text style={styles.description}>45칸을 모두 채웠어요 🎉</Text>

      <View style={styles.recordBox}>
        <Text style={styles.recordLabel}>함께한 기간</Text>

        <Text style={styles.recordPeriod}>
          {getFullDate(room.started_at)} ~ {getFullDate(room.completed_at)}
        </Text>

        <Text style={styles.recordDays}>{days ?? EMPTY_DATE}일 동안 함께했어요</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.archiveButton, saving && styles.archiveButtonDisabled, pressed && PRESSED]}
        onPress={handleArchive}
        disabled={saving}
      >
        <Text style={styles.archiveButtonText}>
          {saving ? '보관하는 중...' : '앨범에 보관하고 새로 시작하기'}
        </Text>
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
    marginTop: 80,
    marginBottom: 20,
  },

  character: {
    width: 130,
    height: 130,
  },

  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    textAlign: 'center',
    paddingVertical: 10,
  },

  description: {
    fontFamily: FONT.regular,
    fontSize: FONT.body,
    color: COLORS.textSub,
    textAlign: 'center',
    paddingBottom: 20,
  },

  recordBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    backgroundColor: COLORS.cardWhite,
    alignItems: 'center',
    marginBottom: 20,
  },

  recordLabel: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    paddingBottom: 8,
  },

  recordPeriod: {
    fontFamily: FONT.semibold,
    fontSize: FONT.cardTitle,
    color: COLORS.navigate,
    paddingBottom: 6,
  },

  recordDays: {
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.text,
  },

  archiveButton: {
    backgroundColor: COLORS.navigate,
    borderRadius: RADIUS.button,
    paddingVertical: 15,
  },

  archiveButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },

  archiveButtonText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.navigateText,
    textAlign: 'center',
  },
});
