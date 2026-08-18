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
import { startQuest } from '../../lib/api/quests';

export default function S51QuestCreate({ navigation }) {
  const [questTitle, setQuestTitle] = useState('');
  const [starting, setStarting] = useState(false);
  const maxLength = 30;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const DANGER_KEYWORDS = ['폭식', '자해', '구토'];

  const handleStart = () => {
    if (!questTitle.trim()) {
      Alert.alert('알림', '퀘스트 내용을 입력해 주세요.');
      return;
    }

    const hasDangerKeyword = DANGER_KEYWORDS.some((keyword) =>
      questTitle.includes(keyword)
    );

    if (hasDangerKeyword) {
      Alert.alert(
        '시작 불가',
        '위험 키워드가 포함된 경우 시작할 수 없습니다.'
      );
      return;
    }

    setStarting(true);

    startQuest(questTitle.trim())
      .then(() => navigation.goBack())
      .catch(() => Alert.alert('시작하지 못했어요', '이미 진행 중인 퀘스트가 있어요'))
      .finally(() => setStarting(false));
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
                value={questTitle}
                onChangeText={setQuestTitle}
                placeholder="예) 저녁 8시 이후 야식 안 먹기"
                placeholderTextColor="#757575"
                multiline={true}
                maxLength={maxLength}
                textAlignVertical="top"
              />

              <Text style={styles.charCount} pointerEvents="none">
                {questTitle.length}/{maxLength}
              </Text>
            </View>


            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleStart}
              disabled={starting}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {starting ? '시작 중...' : '시작하기'}
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
    // backgroundColor: '#F0F5FF',
    // borderRadius: 20,
    // paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
    // fontSize: 15,
    // color: '#1B1A18',
    // textAlign: 'center',
    // borderWidth: 1,
    // borderColor: '#FDFDFF',
    backgroundColor: '#F0F5FF',
    borderWidth: 1,
    borderColor: '#FDFDFF',
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
    fontSize: 13,
    color: '#504D49',
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