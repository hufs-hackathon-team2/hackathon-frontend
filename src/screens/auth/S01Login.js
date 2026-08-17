import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { login } from '../../lib/api/mock/login';
import { saveToken } from '../../lib/api/token';

export default function S01Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const validateEmail = (emailText) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailText);
  };


  const handleEmailBlur = () => {
    setIsEmailFocused(false);
    if (email.trim() && !validateEmail(email.trim())) {
      setErrorMessage('올바른 이메일 형식이 아닙니다.');
    }
  };


  const handleLogin = async () => {
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setErrorMessage('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {

      const data = await login(email, password);

      await saveToken(data.accessToken, data.refreshToken);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      setErrorMessage(error.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>로그인</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={[
                  styles.input,
                  isEmailFocused && styles.inputFocused,
                  errorMessage ? styles.inputError : null,
                ]}
                value={email}
                placeholder="you@example.com"
                placeholderTextColor="#757575"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={handleEmailBlur}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMessage) setErrorMessage('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>비밀번호</Text>
              <TextInput
                style={[
                  styles.input,
                  isPasswordFocused && styles.inputFocused,
                  errorMessage ? styles.inputError : null,
                ]}
                value={password}
                placeholder="비밀번호"
                placeholderTextColor="#757575"
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errorMessage) setErrorMessage('');
                }}
                secureTextEntry
              />
            </View>

            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>

            <View style={styles.linkContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ResetPassword')}
              >
                <Text style={styles.blueLinkText}>
                  비밀번호를 잊으셨나요?
                </Text>
              </TouchableOpacity>

              <View style={styles.signUpRow}>
                <Text style={styles.grayText}>계정이 없으신가요? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Signup')}
                >
                  <Text style={styles.blueLinkText}>회원가입</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3ECFF',
  },
  scrollContent: {
    paddingTop: 60, 
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B1A18',
    textAlign: 'center',
    marginBottom: 36,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1B1A18',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CFCCC9',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1B1A18',
  },
  inputFocused: {
    borderWidth: 1.5,
    borderColor: '#8ba1c5',
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: '#E53E3E',
  },
  errorBanner: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FEB2B2',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#E53E3E',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#3E629F',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
    marginBottom: 32,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    alignItems: 'center',
    gap: 24,
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grayText: {
    fontSize: 14,
    color: '#1B1A18',
  },
  blueLinkText: {
    fontSize: 14,
    color: '#3E629F',
    fontWeight: '500',
  },
});