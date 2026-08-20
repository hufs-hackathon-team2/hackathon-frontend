// AU 05 비밀번호 재설정 — 메일로 받은 코드로 새 비밀번호를 정한다
import React, { useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { requestPasswordReset, confirmPasswordReset } from '../../lib/api/auth';
import { getErrorMessage, getErrorDetails } from '../../lib/api/error';

const MIN_PASSWORD = 8;
const CODE_LENGTH = 6;

export default function S03ResetPassword({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // 'EMAIL' 에서 코드를 보내고, 'TOKEN' 에서 코드와 새 비밀번호를 받는다
  const [step, setStep] = useState('EMAIL');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isemailFocused, setIsemailFocused] = useState(false);

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const [sending, setSending] = useState(false);

  const validateEmail = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setEmailError('');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError('올바른 이메일 형식을 입력해 주세요.');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) validateEmail(text);
  };

  const handleBlur = () => {
    setIsemailFocused(false);
    validateEmail(email);
  };

  // 서버가 이유를 따로 주면 같이 보여준다
  const showError = (error, setter) => {
    const details = getErrorDetails(error);
    const message = getErrorMessage(error);

    setter(details ? `${message}\n${details}` : message);
  };

  const handleSendResetLink = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError('이메일을 입력해 주세요.');
      return;
    }

    if (!validateEmail(trimmedEmail)) return;

    setSending(true);

    requestPasswordReset(trimmedEmail)
      .then(() => {
        setFormError('');
        setStep('TOKEN');
      })
      .catch((error) => showError(error, setEmailError))
      .finally(() => setSending(false));
  };

  const handleConfirm = () => {
    const trimmedToken = token.trim();

    if (trimmedToken.length !== CODE_LENGTH) {
      setFormError(`재설정 코드 ${CODE_LENGTH}자리를 입력해 주세요.`);
      return;
    }

    if (password.length < MIN_PASSWORD) {
      setFormError(`비밀번호는 ${MIN_PASSWORD}자 이상으로 정해주세요.`);
      return;
    }

    setSending(true);

    confirmPasswordReset(trimmedToken, password)
      .then(() => {
        Alert.alert('변경 완료', '새 비밀번호로 로그인해 주세요.', [
          { text: '확인', onPress: () => navigation.navigate('Login') },
        ]);
      })
      .catch((error) => showError(error, setFormError))
      .finally(() => setSending(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inner}
        >
          <ScreenHeader navigation={navigation} />

          <View style={styles.content}>
            <Text style={styles.title}>비밀번호 재설정</Text>

            {step === 'EMAIL' ? (
              <>
                <Text style={styles.subtitle}>
                  가입 시 사용한 이메일을 입력하면 재설정 코드를 보내드립니다.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>이메일</Text>
                  <TextInput
                    style={[
                      styles.input,
                      isemailFocused && styles.inputFocused,
                      emailError ? styles.inputError : null,
                    ]}
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="you@example.com"
                    placeholderTextColor="#757575"
                    onFocus={() => setIsemailFocused(true)}
                    onBlur={handleBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={[styles.sendButton, sending && styles.sendButtonDisabled]}
                  onPress={handleSendResetLink}
                  activeOpacity={0.8}
                  disabled={sending}
                >
                  <Text style={styles.sendButtonText}>
                    {sending ? '보내는 중...' : '재설정 코드 보내기'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.subtitle}>
                  {email.trim()} 으로 코드를 보냈습니다.{'\n'}
                  받은 코드와 새 비밀번호를 입력해 주세요.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>재설정 코드</Text>
                  <TextInput
                    style={[styles.input, styles.codeInput, formError ? styles.inputError : null]}
                    value={token}
                    onChangeText={(text) => {
                      // 숫자만 남기고 6자리에서 끊는다
                      setToken(text.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH));
                      if (formError) setFormError('');
                    }}
                    placeholder="000000"
                    placeholderTextColor="#B8BEC7"
                    keyboardType="number-pad"
                    maxLength={CODE_LENGTH}
                    textContentType="oneTimeCode"
                    autoComplete="sms-otp"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>새 비밀번호</Text>
                  <TextInput
                    style={[styles.input, formError ? styles.inputError : null]}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (formError) setFormError('');
                    }}
                    placeholder={`${MIN_PASSWORD}자 이상`}
                    placeholderTextColor="#757575"
                    secureTextEntry
                  />
                  {formError ? (
                    <Text style={styles.errorText}>{formError}</Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={[styles.sendButton, sending && styles.sendButtonDisabled]}
                  onPress={handleConfirm}
                  activeOpacity={0.8}
                  disabled={sending}
                >
                  <Text style={styles.sendButtonText}>
                    {sending ? '변경 중...' : '비밀번호 변경'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backToLoginButton}
                  onPress={() => {
                    setStep('EMAIL');
                    setFormError('');
                  }}
                  activeOpacity={0.6}
                >
                  <Text style={styles.backToLoginText}>이메일을 다시 입력할게요</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 'EMAIL' && (
              <TouchableOpacity
                style={styles.backToLoginButton}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.6}
              >
                <Text style={styles.backToLoginText}>로그인으로 돌아가기</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3ECFF',
  },
  inner: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B1A18',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#1B1A18',
    lineHeight: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1B1A18',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CFCCC9',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1B1A18',
    backgroundColor: '#FFFFFF',
  },

  codeInput: {
    fontSize: 22,
    letterSpacing: 8,
    textAlign: 'center',
  },

  inputFocused: {
    borderWidth: 2,
    borderColor: '#8BA1C5',
  },
  inputError: {
    borderColor: '#E53E3E',
  },
  errorText: {
    fontSize: 12,
    color: '#E53E3E',
    marginTop: 6,
    fontWeight: '500',
    lineHeight: 17,
  },
  sendButton: {
    backgroundColor: '#3E629F',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  sendButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  backToLoginButton: {
    alignSelf: 'center',
  },
  backToLoginText: {
    fontSize: 14,
    color: '#3E629F',
    fontWeight: '500',
  },
});
