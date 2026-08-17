// ST 01 설정 화면 + AU 04 로그아웃
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';
import { getSettings, logout } from '../../lib/api/settings';

export default function S70Settings({ navigation }) {
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState(null);
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

  const handleLogout = () => {
    Alert.alert('로그아웃할까요?', '', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        onPress: () => {
          logout()
            .then(() => navigation.navigate('Login'))
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

      <Pressable style={styles.row} onPress={() => navigation.navigate('Notifications')}>
        <Text style={styles.rowLabel}>알림 설정</Text>
        <Text style={styles.rowArrow}>{'>'}</Text>
      </Pressable>

      <Pressable style={styles.row} onPress={() => navigation.navigate('ServiceInfo')}>
        <Text style={styles.rowLabel}>서비스 안내</Text>
        <Text style={styles.rowArrow}>{'>'}</Text>
      </Pressable>

      <View style={styles.buttonRow}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </Pressable>

        <Pressable style={styles.withdrawButton} onPress={() => navigation.navigate('Withdraw')}>
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
