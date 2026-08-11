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

export default function S12CharacterSelect({ navigation }) {

  const [selectedCharacter, setSelectedCharacter] = useState('cat');
  const [characterName, setCharacterName] = useState('');


  const handleComplete = () => {
    if (!characterName.trim()) {
      Alert.alert('알림', '캐릭터 이름을 입력해 주세요.');
      return;
    }

    console.log('선택된 캐릭터:', selectedCharacter);
    console.log('캐릭터 이름:', characterName);


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
            <Text style={styles.headerTitle}>캐릭터 선택 화면</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <View style={styles.divider} />


          <View style={styles.content}>
            <Text style={styles.title}>함께할 친구를 골라주세요</Text>
            <Text style={styles.subtitle}>
              선택한 캐릭터는 온보딩 완료 후 변경할 수 없어요
            </Text>


            <View style={styles.cardGroup}>
              <TouchableOpacity
                style={[
                  styles.card,
                  selectedCharacter === 'cat' && styles.selectedCard,
                ]}
                onPress={() => setSelectedCharacter('cat')}
                activeOpacity={0.8}
              >
                <View style={styles.imagePlaceholder}>
                </View>
                <Text
                  style={[
                    styles.cardText,
                    selectedCharacter === 'cat' && styles.selectedCardText,
                  ]}
                >
                  고양이
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.card,
                  selectedCharacter === 'dog' && styles.selectedCard,
                ]}
                onPress={() => setSelectedCharacter('dog')}
                activeOpacity={0.8}
              >
                <View style={styles.imagePlaceholder}>
                </View>
                <Text
                  style={[
                    styles.cardText,
                    selectedCharacter === 'dog' && styles.selectedCardText,
                  ]}
                >
                  강아지
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>캐릭터 이름</Text>
              <TextInput
                style={styles.input}
                value={characterName}
                onChangeText={setCharacterName}
                placeholder="이름을 입력해주세요"
                placeholderTextColor="#A0AEC0"
                autoCapitalize="none"
              />
            </View>


            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleComplete}
            >
              <Text style={styles.submitButtonText}>
                선택 완료하고 계속하기
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
    marginBottom: 28,
  },

  cardGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 28,
  },
  card: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: '#E8ECF4',
    borderRadius: 12,
    padding: 12,
  },
  selectedCard: {
    borderColor: '#1E232C', 
    backgroundColor: '#FFFFFF',
  },
  imagePlaceholder: {
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  cardText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4A5568',
  },
  selectedCardText: {
    fontWeight: '700',
    color: '#1E232C',
  },
  inputContainer: {
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E232C',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8ECF4',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1E232C',
  },
  submitButton: {
    backgroundColor: '#1E232C',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});