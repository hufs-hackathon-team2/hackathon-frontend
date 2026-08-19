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
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signup } from '../../lib/api/auth';
import { saveToken, saveOnboarded } from '../../lib/api/token';
import { getErrorMessage, getErrorField } from '../../lib/api/error';
import ScreenHeader from '../../components/common/ScreenHeader';

export default function S02Signup({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [isRequiredAgreed, setIsRequiredAgreed] = useState(false);
  const [isOptionalAgreed, setIsOptionalAgreed] = useState(false);



  const [focusedInput, setFocusedInput] = useState(null);

  const validateEmail = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setEmailError('');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return false;
    }

    setEmailError('');
    return true;
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError('');
      return false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)\S{8,}$/;
    if (!passwordRegex.test(value)) {
      setPasswordError('8자 이상, 영문과 숫자를 조합해 주세요.');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmValue, currentPassword) => {
    if (!confirmValue) {
      setConfirmPasswordError('');
      return false;
    }

    if (confirmValue !== currentPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    setConfirmPasswordError('');
    return true;
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) validateEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (passwordError) validatePassword(text);
    if (confirmPassword && confirmPasswordError) {
      validateConfirmPassword(confirmPassword, text);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (confirmPasswordError) validateConfirmPassword(text, password);
  };

  const handleSignup = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password || !confirmPassword) {
      Alert.alert('알림', '모든 항목을 입력해 주세요.');
      return;
    }

    const isEmailValid = validateEmail(trimmedEmail);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(
      confirmPassword,
      password
    );

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해 주세요.');
      return;
    }

    if (!isRequiredAgreed) {
      Alert.alert('알림', '필수 약관에 동의해 주세요.');
      return;
    }

    try {
      const data = await signup(trimmedEmail, password, nickname.trim());

      await saveToken(data.access, data.refresh);

      // 가입 직후는 무조건 온보딩 전이다
      await saveOnboarded(false);

      Alert.alert('회원가입 완료', '회원가입이 성공적으로 완료되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.navigate('SignupComplete'),
        },
      ]);
    } catch (error) {
      const message = getErrorMessage(error);
      const field = getErrorField(error);

      // 어느 칸이 문제인지 알면 그 칸 아래에도 띄운다
      if (field === 'email') setEmailError(message);
      if (field === 'password') setPasswordError(message);

      Alert.alert('회원가입 실패', message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inner}
        >
          <ScreenHeader navigation={navigation} />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>계정 만들기</Text>
            <Text style={styles.subtitle}>헬플리와 함께 시작해 보세요</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>닉네임</Text>

              <View>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithCount,
                    focusedInput === 'nickname' && styles.inputFocused,
                  ]}
                  value={nickname}
                  onChangeText={setNickname}
                  onFocus={() => setFocusedInput('nickname')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="앱에서 사용할 이름"
                  placeholderTextColor="#757575"
                  maxLength={10}
                />

                <Text style={styles.nicknameCount} pointerEvents="none">
                  {nickname.length}/10
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'email' && styles.inputFocused,
                  emailError ? styles.inputError : null,
                ]}
                value={email}
                onChangeText={handleEmailChange}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => {
                  setFocusedInput(null);
                  validateEmail(email);
                }}
                placeholder="you@example.com"
                placeholderTextColor="#757575"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'password' && styles.inputFocused,
                  passwordError ? styles.inputError : null,
                ]}
                value={password}
                onChangeText={handlePasswordChange}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => {
                  setFocusedInput(null);
                  validatePassword(password);
                }}
                placeholder="비밀번호"
                placeholderTextColor="#757575"
                secureTextEntry
              />
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : (
                <Text style={styles.guideText}>
                  8자 이상, 영문과 숫자 포함
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호 확인</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'confirmPassword' && styles.inputFocused,
                  confirmPasswordError ? styles.inputError : null,
                ]}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => {
                  setFocusedInput(null);
                  validateConfirmPassword(confirmPassword, password);
                }}
                placeholder="비밀번호 확인"
                placeholderTextColor="#757575"
                secureTextEntry
              />
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : (
                <Text style={styles.guideText}>
                  위 비밀번호와 동일하게 입력하세요
                </Text>
              )}
            </View>

            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setIsRequiredAgreed(!isRequiredAgreed)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    isRequiredAgreed && styles.checkboxChecked,
                  ]}
                >
                  {isRequiredAgreed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  이용약관, 개인정보 처리방침에 동의합니다 (필수)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setIsOptionalAgreed(!isOptionalAgreed)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    isOptionalAgreed && styles.checkboxChecked,
                  ]}
                >
                  {isOptionalAgreed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>마케팅 정보 수신 (선택)</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSignup}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>가입하기</Text>
            </TouchableOpacity>
          </ScrollView>
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
  header: {
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B1A18',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#1B1A18',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B1A18',
    marginBottom: 8,
  },
  inputWithCount: {
    paddingRight: 56,
  },
  nicknameCount: {
    position: 'absolute',
    right: 16,
    top: 0,
    height: 52,
    lineHeight: 52,
    fontSize: 13,
    color: '#928c83',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CFCCC9',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1B1A18',
  },
  inputFocused: {
    borderColor: '#8BA1C5',
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#E53E3E',
  },
  guideText: {
    fontSize: 12,
    color: '#504D49',
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#E53E3E',
    marginTop: 6,
    fontWeight: '500',
  },
  termsContainer: {
    marginTop: 10,
    marginBottom: 28,
    gap: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#868079',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#3E629F',
    borderColor: '#3E629F',
  },
  checkmark: {
    color: '#E3ECFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 13.5,
    color: '#1B1A18',
  },
  submitButton: {
    backgroundColor: '#3E629F',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});