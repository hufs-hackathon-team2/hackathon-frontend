import React, { useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';

export default function S03Signup({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');


  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nicknameError, setNicknameError] = useState('');


  const [isRequiredAgreed, setIsRequiredAgreed] = useState(false);
  const [isOptionalAgreed, setIsOptionalAgreed] = useState(false);

  // 더미 기존 가입된 이메일 목록
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


  const validateNickname = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setNicknameError('');
      return false;
    }

    if (trimmed.length < 2 || trimmed.length > 10) {
      setNicknameError('닉네임은 2자~10자여야 합니다.');
      return false;
    }

    setNicknameError('');
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

  const handleNicknameChange = (text) => {
    setNickname(text);
    if (nicknameError) validateNickname(text);
  };


  const handleSignup = () => {
    const trimmedEmail = email.trim();
    const trimmedNickname = nickname.trim();


    if (!trimmedEmail || !password || !confirmPassword || !trimmedNickname) {
      Alert.alert('알림', '모든 항목을 입력해 주세요.');
      return;
    }


    const isEmailValid = validateEmail(trimmedEmail);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, password);
    const isNicknameValid = validateNickname(trimmedNickname);


    if (
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid ||
      !isNicknameValid
    ) {
      return;
    }


    if (!isRequiredAgreed) {
      Alert.alert('알림', '필수 약관에 동의해 주세요.');
      return;
    }


    console.log('회원가입 성공:', {
      email: trimmedEmail,
      password,
      nickname: trimmedNickname,
      isOptionalAgreed,
    });

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

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backButtonText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>회원가입 화면</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <View style={styles.divider} />


          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>계정 만들기</Text>
            <Text style={styles.subtitle}>헬플리와 함께 시작해 보세요</Text>


            <View style={styles.inputGroup}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                value={email}
                onChangeText={handleEmailChange}
                onBlur={() => validateEmail(email)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : (
                <Text style={styles.guideText}>
                  등록되지 않은 이메일 주소를 사용하세요
                </Text>
              )}
            </View>


            <View style={styles.inputGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={() => validatePassword(password)}
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
                  confirmPasswordError ? styles.inputError : null,
                ]}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                onBlur={() => validateConfirmPassword(confirmPassword, password)}
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>닉네임</Text>
              <TextInput
                style={[styles.input, nicknameError ? styles.inputError : null]}
                value={nickname}
                onChangeText={handleNicknameChange}
                onBlur={() => validateNickname(nickname)}
                autoCapitalize="none"
                maxLength={10}
              />
              {nicknameError ? (
                <Text style={styles.errorText}>{nicknameError}</Text>
              ) : (
                <Text style={styles.guideText}>2자 이상, 10자 이하로 입력해 주세요</Text>
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
                <Text style={styles.termsTitle}>필수 약관 동의</Text>
                <Text style={styles.termsDesc}>
                  이용약관, 개인정보 처리방침에 동의합니다
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
                <Text style={styles.termsTitle}>선택 약관 동의</Text>
                <Text style={styles.termsDesc}>마케팅 정보 수신 (선택)</Text>
              </TouchableOpacity>
            </View>


            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSignup}
              >
                <Text style={styles.submitButtonText}>가입하기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  inner: {
    flex: 1,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E232C',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E232C',
  },
  headerRightPlaceholder: {
    width: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8ECF4',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E232C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E232C',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1E232C',
  },
  inputError: {
    borderColor: '#E53E3E',
  },
  guideText: {
    fontSize: 12,
    color: '#718096',
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
    marginBottom: 36,
    gap: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#1E232C',
    borderColor: '#1E232C',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E232C',
    marginRight: 12,
  },
  termsDesc: {
    fontSize: 13,
    color: '#4A5568',
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#1E232C',
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#1E232C',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#1E232C',
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});