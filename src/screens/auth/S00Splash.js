// AU 03 자동 로그인 / 토큰 확인 — 앱의 진입 화면 (App.js initialRouteName)
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getAccessToken } from '../../lib/api/token';
import { getSettings } from '../../lib/api/settings';
import { COLORS, FONT, SPACE } from '../../lib/theme';

export default function S00Splash({ navigation }) {

  // 쌓인 화면 없이 목적지 하나만 남긴다
  const go = (name) => {
    navigation.reset({ index: 0, routes: [{ name }] });
  };

  const decide = async () => {
    const token = await getAccessToken();

    if (!token) {
      go('Welcome');
      return;
    }

    try {
      // 토큰이 아직 살아 있는지 확인하면서 온보딩 여부도 같이 받아온다
      const settings = await getSettings();
      go(settings.onboardingCompleted ? 'Main' : 'Interests');
    } catch {
      go('Welcome');
    }
  };

  useEffect(() => {
    decide();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>헬플리</Text>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACE.screen,
    backgroundColor: COLORS.bg,
  },

  logo: {
    fontFamily: FONT.bold,
    fontSize: 32,
    color: COLORS.text,
    marginBottom: 24,
  },
});
