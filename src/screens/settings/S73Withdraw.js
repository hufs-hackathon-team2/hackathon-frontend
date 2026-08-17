// AU 06 회원 탈퇴
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';
import { withdraw } from '../../lib/api/settings';

const DELETED_ITEMS = [
  '작성했던 퀘스트 이력',
  '캐릭터 성장 진행도',
  '위클리 카드 분석 결과',
  '계정 정보 및 개인화 데이터',
];

export default function S73Withdraw({ navigation }) {
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isValid = password.trim().length > 0;

  const handleChange = (text) => {
    setPassword(text);
    setErrorMessage('');
  };

  // 쌓여 있던 화면을 모두 버리고 로그인만 남긴다
  const goToLogin = () => {
    const root = navigation.getParent()?.getParent() ?? navigation;
    root.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  const removeAccount = () => {
    setDeleting(true);
    setErrorMessage('');

    withdraw(password)
      .then(() => {
        Alert.alert('탈퇴가 완료되었습니다', '이용해 주셔서 감사합니다. 모든 데이터가 삭제되었어요.', [
          { text: '확인', onPress: goToLogin },
        ]);
      })
      .catch(() => setErrorMessage('비밀번호가 일치하지 않아요'))
      .finally(() => setDeleting(false));
  };

  const handleWithdraw = () => {
    Alert.alert('정말 탈퇴하시겠어요?', '계정과 모든 서비스 데이터가 삭제됩니다. 복구할 수 없으니 신중하게 선택해주세요.', [
      { text: '취소', style: 'cancel' },
      { text: '탈퇴', style: 'destructive', onPress: removeAccount },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.inner}
        >
          <ScreenHeader navigation={navigation} />

          <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.title}>회원 탈퇴</Text>
            <Text style={styles.description}>계정을 삭제하려면 현재 비밀번호를 입력해주세요.</Text>

            <TextInput
              style={[styles.input, errorMessage !== '' && styles.inputError]}
              value={password}
              onChangeText={handleChange}
              placeholder="비밀번호"
              placeholderTextColor={COLORS.textSub}
              secureTextEntry={true}
            />

            {errorMessage !== '' && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <View style={styles.warningCard}>
              <Text style={styles.warningTitle}>탈퇴 시 다음 데이터가 삭제됩니다</Text>

              {DELETED_ITEMS.map((item) => (
                <Text key={item} style={styles.warningItem}>· {item}</Text>
              ))}
            </View>

            <Text style={styles.notice}>삭제한 데이터는 복구할 수 없습니다.</Text>

            <Pressable
              style={[styles.withdrawButton, !isValid && styles.withdrawButtonDisabled]}
              onPress={handleWithdraw}
              disabled={!isValid || deleting}
            >
              <Text style={styles.withdrawText}>
                {deleting ? '처리 중' : '탈퇴하기'}
              </Text>
            </Pressable>

          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  inner: {
    flex: 1,
  },

  container: {
    paddingHorizontal: SPACE.screen,
    paddingBottom: 30,
    flexGrow: 1,
  },

  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingTop: 20,
    paddingBottom: 6,
  },

  description: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.cardWhite,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FONT.regular,
    fontSize: FONT.subbody,
    color: COLORS.text,
    marginBottom: 20,
  },

  inputError: {
    borderColor: COLORS.dangerStrong,
    marginBottom: 6,
  },

  errorText: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.dangerStrong,
    marginBottom: 20,
  },

  warningCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
    padding: SPACE.card,
  },

  warningTitle: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.text,
    marginBottom: 10,
  },

  warningItem: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    lineHeight: 22,
  },

  notice: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginTop: 10,
  },

  withdrawButton: {
    alignSelf: 'flex-end',
    width: 81,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dangerStrong,
    borderRadius: 999,
    marginTop: 24,
  },

  withdrawButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },

  withdrawText: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.dangerStrongText,
  },

});
