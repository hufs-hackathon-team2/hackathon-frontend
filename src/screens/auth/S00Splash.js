// AU 03 자동 로그인 / 토큰 확인 — 앱의 진입 화면 (App.js initialRouteName)
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getAccessToken, getOnboarded, clearToken } from '../../lib/api/token';
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
      // 토큰이 아직 살아 있는지 확인한다. 만료됐으면 401 이 나서 아래 catch 로 간다.
      const settings = await getSettings();

      // 서버 값이 있으면 그걸 쓰고, 없으면 로그인할 때 저장해둔 값으로 판단한다.
      // 지금 GET /settings 는 nickname·email 만 준다.
      const onboarded = settings.onboarding_completed ?? (await getOnboarded());

      // 서버도 폰도 모르는 상태. 온보딩으로 보내면 빠져나올 길이 없어 로그인부터 다시 받는다.
      if (onboarded == null) {
        go('Welcome');
        return;
      }

      go(onboarded ? 'Main' : 'Interests');
    } catch (error) {
      // 토큰이 만료됐으면 지운다. 남겨두면 다른 화면에서 계속 401 이 난다.
      if (error.response?.status === 401) await clearToken();

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
