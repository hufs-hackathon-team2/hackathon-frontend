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
import ScreenHeader from '../../components/common/ScreenHeader';

export default function S02Signup({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');


  const [focusedInput, setFocusedInput] = useState(null);

  const [isRequiredAgreed, setIsRequiredAgreed] = useState(false);
  const [isOptionalAgreed, setIsOptionalAgreed] = useState(false);

  const existingEmails = ['test@example.com', 'user@test.com', 'admin@helply.com'];

  const validateEmail = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setEmailError('');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return false;
    }

    if (existingEmails.includes(trimmed)) {
      setEmailError('이미 가입된 이메일이에요');
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

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
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

  const handleSignup = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password || !confirmPassword) {
      Alert.alert('알림', '모든 항목을 입력해 주세요.');
      return;
    }

    const isEmailValid = validateEmail(trimmedEmail);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, password);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    if (!isRequiredAgreed) {
      Alert.alert('알림', '필수 약관에 동의해 주세요.');
      return;
    }

    Alert.alert('회원가입 완료', '회원가입이 성공적으로 완료되었습니다!', [
      {
        text: '확인',
        onPress: () => navigation.navigate('Interests'),
      },
    ]);
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
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'email' && styles.inputFocused,
                  emailError ? styles.inputError : null,
                ]}
                value={email}
                placeholder="you@example.com"
                placeholderTextColor="#757575"
                onChangeText={handleEmailChange}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => {
                  setFocusedInput(null);
                  validateEmail(email);
                }}
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
                placeholder="비밀번호"
                placeholderTextColor="#A0AEC0"
                onChangeText={handlePasswordChange}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => {
                  setFocusedInput(null);
                  validatePassword(password);
                }}
                secureTextEntry
              />
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : (
                <Text style={styles.guideText}>8자 이상, 영문과 숫자 포함</Text>
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
                placeholder="비밀번호 확인"
                placeholderTextColor="#A0AEC0"
                onChangeText={handleConfirmPasswordChange}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => {
                  setFocusedInput(null);
                  validateConfirmPassword(confirmPassword, password);
                }}
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
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B1A18',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#1B1A18',
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1B1A18',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1B1A18',
  },
  inputFocused: {
    borderWidth: 1.5,
    borderColor: '#8BA1C5',
  },
  inputError: {
    borderWidth: 1.5,
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
    marginTop: 12,
    marginBottom: 28,
    gap: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#868079',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: '#3E629F',
    borderColor: '#3E629F',
  },
  checkmark: {
    color: '#E3ECFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 14,
    color: '#1B1A18',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#3E629F',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});