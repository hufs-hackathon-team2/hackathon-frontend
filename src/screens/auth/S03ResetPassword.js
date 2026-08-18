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

export default function S04ResetPassword({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isemailFocused, setIsemailFocused] = useState(false);

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


  const handleBlur = () => {
    setIsemailFocused(false);
    validateEmail(email);
  };

  const handleSendResetLink = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError('이메일을 입력해 주세요.');
      return;
    }

    const isValid = validateEmail(trimmedEmail);
    if (!isValid) return;

    Alert.alert(
      '발송 완료',
      '가입하신 이메일로 비밀번호 재설정 링크를 보냈습니다. 이메일을 확인해 주세요.',
      [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]
    );
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
            <Text style={styles.subtitle}>
              가입 시 사용한 이메일을 입력하면 재설정 링크를 보내드립니다.
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
              style={styles.sendButton}
              onPress={handleSendResetLink}
              activeOpacity={0.8}
            >
              <Text style={styles.sendButtonText}>재설정 링크 보내기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.6}
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