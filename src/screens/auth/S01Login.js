import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function S01Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 입력창 포커스 상태 관리
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = () => {
    setErrorMessage('');

    const MOCK_USER = {
      email: 'test@example.com',
      password: 'password123',
    };

    if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
      setErrorMessage('이메일 또는 비밀번호를 확인해주세요');
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inner}
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
                placeholderTextColor="#A0AEC0"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
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
                placeholderTextColor="#A0AEC0"
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

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>

            <View style={styles.linkContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ResetPassword')}
              >
                <Text style={styles.blueLinkText}>비밀번호를 잊으셨나요?</Text>
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
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EEFF',
  },

  inner: {
    flex: 1,
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 36,
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
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
    color: '#111111',
  },


  inputFocused: {
    borderWidth: 1.5,
    borderColor: '#4C5F99', 
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
    backgroundColor: '#4C5F99',
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
    color: '#333333',
  },

  blueLinkText: {
    fontSize: 14,
    color: '#3F51B5',
    fontWeight: '500',
  },
});