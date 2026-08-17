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
            <Text style={styles.title}>오늘 나를 위한 기록</Text>
            <Text style={styles.subtitle}>
              건강에 도움이 된 행동을 자유롭게 적어보세요.{'\n'}작은 것도 충분히 소중합니다.
            </Text>


            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textArea}
                value={logContent}
                onChangeText={setLogContent}
                placeholder="예) 오늘 점심에 채소를 챙겨 먹었어요"
                placeholderTextColor="#8A94A6"
                multiline={true}
                numberOfLines={5}
                maxLength={maxLength}
                textAlignVertical="top"
              />

            </View>

            <Text style={styles.noticeText}>
              위험 키워드가 포함된 경우 저장되지 않습니다.
            </Text>


            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveButtonText}>저장하기</Text>
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
    lineHeight: 20,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#F0F5FF',
    borderRadius: 18,
    height: 160,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 15,
    color: '#1B1A18',
  },

  noticeText: {
    fontSize: 13,
    color: '#504D49',
    marginBottom: 28,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#3E629F',
    borderRadius: 24,
    height: 48,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});