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
import { createLog } from '../../lib/api/logs';
import { getErrorMessage } from '../../lib/api/error';
import { COLORS, FONT } from '../../lib/theme';

export default function S21LogNew({ navigation }) {
  const [logContent, setLogContent] = useState('');
  const [saving, setSaving] = useState(false);
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

    setSaving(true);

    createLog(logContent.trim())
      .then((res) => {
        const message = res.asset
          ? '오늘의 기록이 저장되었습니다.\n스티커판에 새 스티커가 붙었어요!'
          : '오늘의 기록이 저장되었습니다.';

        Alert.alert('저장 완료', message, [
          {
            text: '확인',
            onPress: () => {
              navigation.goBack();

              if (res.new_cycle_started) {
                navigation.navigate('Resume');
              }
            },
          },
        ]);
      })
      .catch((error) => Alert.alert('저장하지 못했어요', getErrorMessage(error)))
      .finally(() => setSaving(false));
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

              <Text style={styles.charCount} pointerEvents="none">
                {logContent.length}/{maxLength}
              </Text>
            </View>

            <Text style={styles.noticeText}>
              위험 키워드가 포함된 경우 저장되지 않습니다.
            </Text>


            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {saving ? '저장 중...' : '저장하기'}
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
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center', 
    alignItems: 'center',
    paddingBottom: 60,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: 14,
    color: COLORS.text,
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

  charCount: {
    position: 'absolute',
    right: 20,
    bottom: 12,
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
  },

  noticeText: {
    fontFamily: FONT.regular,
    fontSize: 13,
    color: COLORS.textSub,
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
    fontFamily: FONT.semibold,
    fontSize: 15,
    color: COLORS.navigateText,
  },
});