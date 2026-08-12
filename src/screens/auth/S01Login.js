import React, { useState } from 'react';

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
  Alert,
} from 'react-native';



export default function S01Login({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleLogin = () => {

    setErrorMessage('');


    // API 연결 전 임의 테스트 아이디, 비번 (다르게 입력 시 오류)

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

          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backButtonText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>로그인</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <View style={styles.divider} />
          <View style={styles.content}>
            <Text style={styles.title}>로그인</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>이메일</Text>
              <TextInput
                style={[styles.input, errorMessage ? styles.inputError : null]}
                value={email}
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
                style={[styles.input, errorMessage ? styles.inputError : null]}
                value={password}
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


            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>

            <View style={styles.linkContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ResetPassword')}
              >
                <Text style={styles.underlineText}>비밀번호를 잊으셨나요?</Text>
              </TouchableOpacity>



              <View style={styles.signUpRow}>
                <Text style={styles.grayText}>계정이 없으신가요? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Signup')}
                >
                  <Text style={styles.underlineText}>회원가입</Text>
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

  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E232C',
    marginBottom: 28,
  },

  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
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
  },

  loginButton: {
    backgroundColor: '#222831',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 32,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  linkContainer: {
    alignItems: 'center',
    gap: 16,
  },

  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  grayText: {
    fontSize: 14,
    color: '#4A5568',
  },

  underlineText: {
    fontSize: 14,
    color: '#4A5568',
    textDecorationLine: 'underline',
  },
});