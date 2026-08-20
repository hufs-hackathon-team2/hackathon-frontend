// ST 01 설정 화면 + AU 04 로그아웃
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT, SPACE, RADIUS, PRESSED } from '../../lib/theme';
import { getSettings, logout } from '../../lib/api/settings';
import { getRoom } from '../../lib/api/characters';
import { getCharacterStages, getStageIndex } from '../../lib/assets';

export default function S70Settings({ navigation }) {
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    getSettings()
      .then(setSettings)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();

    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  // 쌓여 있던 화면을 모두 버리고 로그인만 남긴다
  const goToLogin = () => {
    const root = navigation.getParent()?.getParent() ?? navigation;
    root.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  const handleLogout = () => {
    Alert.alert('로그아웃할까요?', '', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        onPress: () => {
          logout()
            .then(goToLogin)
            .catch(() => Alert.alert('로그아웃하지 못했어요', '잠시 후 다시 시도해주세요'));
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !settings) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>설정을 불러오지 못했어요</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 5 }]}>

      <Text style={styles.title}>설정</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          {room ? (
            <Image
              source={getCharacterStages(room.character_type)[getStageIndex(room.current_stage)]}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.avatarLetter}>{settings.nickname?.slice(0, 1) ?? '?'}</Text>
          )}
        </View>

        <View style={styles.profileText}>
          <Text style={styles.nickname} numberOfLines={1}>
            {settings.nickname ?? '이름 없음'}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {settings.email ?? '—'}
          </Text>
        </View>
      </View>

      <Pressable style={({ pressed }) => [styles.row, pressed && PRESSED]} onPress={() => navigation.navigate('ServiceInfo')}>
        <Text style={styles.rowLabel}>서비스 안내</Text>
        <Text style={styles.rowArrow}>{'>'}</Text>
      </Pressable>

      <View style={styles.buttonRow}>
        <Pressable style={({ pressed }) => [styles.logoutButton, pressed && PRESSED]} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </Pressable>

        <Pressable style={({ pressed }) => [styles.withdrawButton, pressed && PRESSED]} onPress={() => navigation.navigate('Withdraw')}>
          <Text style={styles.withdrawText}>회원 탈퇴</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACE.screen,
    backgroundColor: COLORS.bg,
    flexGrow: 1,
  },

  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingVertical: 20,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: SPACE.card,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  avatarImage: {
    width: '72%',
    height: '72%',
  },

  avatarLetter: {
    fontFamily: FONT.bold,
    fontSize: FONT.subTitle,
    color: COLORS.navigate,
  },

  profileText: {
    flex: 1,
  },

  nickname: {
    fontFamily: FONT.bold,
    fontSize: FONT.cardTitle,
    color: COLORS.text,
    marginBottom: 4,
  },

  email: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  rowLabel: {
    fontFamily: FONT.regular,
    fontSize: FONT.body,
    color: COLORS.text,
  },

  rowArrow: {
    fontFamily: FONT.regular,
    fontSize: FONT.body,
    color: COLORS.textSub,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 40,
  },

  logoutButton: {
    backgroundColor: COLORS.cardWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  logoutText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.text,
  },

  withdrawButton: {
    backgroundColor: COLORS.danger,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  withdrawText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.dangerText,
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
