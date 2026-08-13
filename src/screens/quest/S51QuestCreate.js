import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
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
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuestCustomCreateScreen({ navigation }) {
  const [questTitle, setQuestTitle] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0); 

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const maxLength = 30;
  // 기존에 존재하는 퀘스트 목록 예시 (중복 시 에러 토스트)
  const existingQuests = ['하루 물 2L 마시기', '10분 산책하기', '영양제 챙겨먹기'];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);


  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height); 
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0); 
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);


  const showCustomToast = (msg) => {
    setToastMessage(msg);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const isValid = questTitle.trim().length > 0;

  const handleStart = () => {
    if (!isValid) return;

    const trimmedTitle = questTitle.trim();

    if (existingQuests.includes(trimmedTitle)) {
      showCustomToast('이미 등록된 퀘스트입니다.');
      return;
    }

    Alert.alert('퀘스트 생성 완료', `'${trimmedTitle}' 퀘스트를 시작합니다!`, [
      {
        text: '확인',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <>
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
            <Text style={styles.headerTitle}>퀘스트 직접 만들기</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>
          <View style={styles.divider} />
          <View style={styles.content}>
            <Text style={styles.title}>직접 만들기</Text>
            <Text style={styles.subtitle}>
              건강한 행동을 적어 작심삼일 퀘스트를 시작해 보세요
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>무엇을 이루고 싶나요?</Text>

              <TextInput
                style={styles.textArea}
                value={questTitle}
                onChangeText={setQuestTitle}
                placeholder=""
                placeholderTextColor="#A0AEC0"
                multiline={true}
                numberOfLines={3}
                maxLength={maxLength}
                textAlignVertical="top"
              />

              <Text style={styles.charCount}>
                {questTitle.length}/{maxLength}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.startButton,
                !isValid && styles.startButtonDisabled,
              ]}
              onPress={handleStart}
              disabled={!isValid}
              activeOpacity={0.8}
            >

              <Text
                style={[
                  styles.startButtonText,
                  !isValid && styles.startButtonTextDisabled,
                ]}
              >
                시작하기
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      </SafeAreaView>

      <Animated.View
        style={[
          styles.toastContainer,
          {
            bottom: keyboardHeight > 0 ? keyboardHeight - 65 : 40,
            opacity: fadeAnim,
          },
        ]}
        pointerEvents="none"
      >
        <Text style={styles.toastText}>{toastMessage}</Text>
      </Animated.View>
    </> 
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
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E232C',
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    height: 90,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E232C',
  },
  charCount: {
    fontSize: 13,
    color: '#718096',
    marginTop: 8,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#1E232C',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 28,
  },
  startButtonDisabled: {
    backgroundColor: '#C2C2C2',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  startButtonTextDisabled: {
    color: '#FFFFFF',
  },

  toastContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    backgroundColor: 'rgba(30, 35, 44, 0.95)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});