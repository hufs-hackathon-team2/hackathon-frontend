// 앱 첫 화면 — 로그인 전 진입점
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';

export default function Welcome({ navigation }) {

  // 개발용 — 로그인 없이 화면을 확인할 때 쓴다
  const handleAdmin = () => {
    Alert.alert('개발용 이동', '어디로 갈까요?', [
      { text: '온보딩', onPress: () => navigation.navigate('Interests') },
      { text: '홈', onPress: () => navigation.navigate('Main') },
      { text: '취소', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>

      <View style={styles.logoBox}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../../assets/healply_logo.png')}
            style={styles.logoMark}
            resizeMode="contain"
          />
          <Text style={styles.logo}>HEALPLY</Text>
        </View>

        <Text style={styles.slogan}>건강한 습관을 쌓는 가장 가벼운 방법</Text>
      </View>

      <Pressable style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>로그인</Text>
      </Pressable>

      <Pressable style={styles.signupButton} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>회원가입</Text>
      </Pressable>

      <Pressable style={styles.adminButton} onPress={handleAdmin}>
        <Text style={styles.adminText}>관리자</Text>
      </Pressable>

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

  logoBox: {
    alignItems: 'center',
    marginBottom: 60,
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },

  // 원본이 68px 이라 그보다 크게 늘리면 흐려진다.
  logoMark: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },

  logo: {
    fontFamily: FONT.bold,
    fontSize: 40,
    color: COLORS.navigate,
    letterSpacing: -1,
  },

  slogan: {
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.textSub,
  },

  loginButton: {
    width: '100%',
    backgroundColor: COLORS.navigate,
    borderRadius: RADIUS.button,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },

  loginText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.navigateText,
  },

  signupButton: {
    width: '100%',
    backgroundColor: COLORS.cardWhite,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.button,
    paddingVertical: 15,
    alignItems: 'center',
  },

  signupText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.body,
    color: COLORS.text,
  },

  adminButton: {
    marginTop: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  adminText: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
  },
});
