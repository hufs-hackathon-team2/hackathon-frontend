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
import { saveInterest } from '../../lib/api/onboarding';
import { clearToken } from '../../lib/api/token';

export default function S11Interests({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [interestText, setInterestText] = useState('');
  const [saving, setSaving] = useState(false);
  const maxLength = 100;

  const handleNext = async () => {
    if (!interestText.trim()) {
      Alert.alert('관심 영역 입력', '관심 영역을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      await saveInterest(interestText.trim());
      navigation.navigate('CharacterSelect');
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400) {
        Alert.alert('저장 실패', '관심 영역은 100자 이하로 입력해주세요.');
      } else if (status === 401) {
        Alert.alert('저장 실패', '로그인이 필요합니다. 다시 로그인해주세요.');
      } else {
        Alert.alert('저장 실패', '관심 영역을 저장하지 못했어요. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setSaving(false);
    }

  };

  // 온보딩은 뒤로 갈 스택이 없다. 저장이 계속 실패하면 여기서 못 빠져나가므로
  // 토큰을 지우고 처음 화면으로 돌아갈 길을 하나 열어 둔다.
  const handleExit = () => {
    Alert.alert('다른 계정으로 시작할까요?', '지금 계정에서 로그아웃되고 처음 화면으로 돌아갑니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '나가기',
        style: 'destructive',
        onPress: async () => {
          await clearToken();
          navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.inner}
        >

          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={handleExit}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.exitText}>다른 계정으로 시작</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>어떤 습관을 바꾸고 싶으신가요?</Text>
            <Text style={styles.subtitle}>
              건강에 도움이 될 활동을 자유롭게 적어주세요
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textArea}
                value={interestText}
                onChangeText={setInterestText}
                placeholder="예) 밤에 늦게까지 휴대폰을 봐요"
                placeholderTextColor="#8A94A6"
                multiline={true}
                numberOfLines={4}
                maxLength={maxLength}
                textAlignVertical="top"
              />
            </View>


            <TouchableOpacity
              style={[styles.nextButton, saving && styles.nextButtonDisabled]}
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={saving}
            >
              <Text style={styles.nextButtonText}>
                {saving ? '저장 중...' : '다음'}
              </Text>
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
  topBar: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  exitText: {
    fontSize: 13,
    color: '#504D49',
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B1A18',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#1B1A18',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 28,
  },
  textArea: {
    backgroundColor: '#F0F5FF',
    borderWidth: 1,
    borderColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
    borderRadius: 18,
    height: 160,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 15,
    color: '#1B1A18',
  },
  nextButton: {
    backgroundColor: '#3E629F', 
    borderRadius: 24,
    height: 48,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  nextButtonDisabled: {
    backgroundColor: '#A0A0A0', 
  },
});