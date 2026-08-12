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
  Alert,
} from 'react-native';

export default function S04ResetPassword({ navigation }) {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');


  const validateEmail = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setEmailError('');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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


  const handleSendResetLink = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError('이메일을 입력해 주세요.');
      return;
    }

    const isValid = validateEmail(trimmedEmail);
    if (!isValid) return;


    console.log('재설정 링크 발송 요청 이메일:', trimmedEmail);
    Alert.alert(
      '발송 완료',
      '가입하신 이메일로 비밀번호 재설정 링크를 보냈습니다. 이메일을 확인해 주세요.',
      [
        {
          text: '확인',
          onPress: () => navigation.navigate('Login'), 
        },
      ]
    );
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
            <Text style={styles.headerTitle}>비밀번호 재설정 화면</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <View style={styles.divider} />


          <View style={styles.content}>
            <Text style={styles.title}>비밀번호 재설정</Text>
            <Text style={styles.subtitle}>
              가입 시 사용한 이메일을 입력하면 재설정 링크를 보내드립니다.
            </Text>


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
              ) : null}
            </View>


            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendResetLink}
            >
              <Text style={styles.sendButtonText}>재설정 링크 발송</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.backToLoginText}>로그인으로 돌아가기</Text>
            </TouchableOpacity>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
    marginBottom: 24,
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
  errorText: {
    fontSize: 12,
    color: '#E53E3E',
    marginTop: 6,
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#1E232C',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  backToLoginButton: {
    alignSelf: 'flex-start',
  },
  backToLoginText: {
    fontSize: 14,
    color: '#718096',
    textDecorationLine: 'underline',
  },
});