// AU 03 자동 로그인 / 토큰 확인 — 앱의 진입 화면 (App.js initialRouteName)
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getAccessToken } from '../../lib/api/token';
import { getSettings } from '../../lib/api/settings';
import { COLORS, FONT, SPACE } from '../../lib/theme';

export default function S00Splash({ navigation }) {

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
      const settings = await getSettings();
      go(settings.onboarding_completed ? 'Main' : 'Interests');
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
