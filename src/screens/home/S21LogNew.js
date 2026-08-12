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

export default function S21PlusLogInput({ navigation }) {
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

    console.log('저장된 PLUS Log:', logContent);
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
            <Text style={styles.headerTitle}>PLUS Log 입력 화면</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <View style={styles.divider} />


          <View style={styles.content}>
            <Text style={styles.title}>오늘 나를 위한 기록</Text>
            <Text style={styles.subtitle}>
              건강에 도움이 된 행동을 자유롭게 적어보세요. 작은 것도 충분히 소중합니다.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.exampleText}>예: 점심 후 10분 산책했어요</Text>
              
              <TextInput
                style={styles.textArea}
                value={logContent}
                onChangeText={setLogContent}
                placeholder=""
                multiline={true}
                numberOfLines={5}
                maxLength={maxLength}
                textAlignVertical="top"
              />

              <Text style={styles.charCount}>
                {logContent.length} / {maxLength}
              </Text>
            </View>


            <Text style={styles.noticeText}>
              위험 키워드가 포함된 경우 저장되지 않습니다.
            </Text>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
  inputContainer: {
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 15,
    color: '#1E232C',
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    height: 120,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E232C',
  },
  charCount: {
    fontSize: 13,
    color: '#4A5568',
    textAlign: 'right',
    marginTop: 8,
    marginBottom: 16,
  },
  noticeText: {
    fontSize: 13,
    color: '#4A5568',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#1E232C',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});