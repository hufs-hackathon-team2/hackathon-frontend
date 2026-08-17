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

export default function S21LogNew({ navigation }) {
  const [logContent, setLogContent] = useState('');
  const maxLength = 200;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // 위험 키워드 예시
  const DANGER_KEYWORDS = ['폭식', '자해', '구토'];

  const handleSave = () => {
    if (!logContent.trim()) {
      Alert.alert('알림', '기록 내용을 입력해 주세요.');
      return;
    }

    const hasDangerKeyword = DANGER_KEYWORDS.some((keyword) =>
      logContent.includes(keyword)
    );

    if (hasDangerKeyword) {
      Alert.alert(
        '저장 불가',
        '위험 키워드가 포함된 경우 저장되지 않습니다.'
      );
      return;
    }

    Alert.alert('저장 완료', '오늘의 기록이 저장되었습니다.', [
      {
        text: '확인',
        onPress: () => navigation.goBack(),
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

          <ScreenHeader navigation={navigation} />

          <View style={styles.content}>
            <Text style={styles.title}>직접 만들기</Text>
            <Text style={styles.subtitle}>
              건강한 행동을 적어 작심삼일 퀘스트를 시작해 보세요
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textArea}
                value={logContent}
                onChangeText={setLogContent}
                placeholder="예) 저녁 8시 이후 야식 안 먹기"
                placeholderTextColor="#757575"
                multiline={true}
                maxLength={maxLength}
                textAlignVertical="top"
              />
            </View>


            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>시작하기</Text>
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
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B1A18',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#1B1A18',
    textAlign: 'center',
    marginBottom: 28,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 32,
  },
  textArea: {
    width: '100%',
    height: 150,
    backgroundColor: '#F0F5FF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 15,
    color: '#1B1A18',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#FDFDFF'
  },
  saveButton: {
    backgroundColor: '#3E629F',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});