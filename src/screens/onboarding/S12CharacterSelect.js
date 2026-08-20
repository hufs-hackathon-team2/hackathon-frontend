import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { saveCharacter } from '../../lib/api/onboarding';
import { saveCharacterName } from '../../lib/api/token';
import { getErrorMessage } from '../../lib/api/error';

const CHARACTER_DATA = {
  cat: {
    id: 'cat',
    name: '고양이',
    image: require('../../../assets/character/cat-1.png'),
  },
  dog: {
    id: 'dog',
    name: '강아지',
    image: require('../../../assets/character/dog-1.png'),
  },
};

export default function S12CharacterSelect({ navigation, route }) {

  const renew = route.params?.renew === true;

  const [selectedCharacter, setSelectedCharacter] = useState('cat');
  const [characterName, setCharacterName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleComplete = async () => {
    const name = characterName.trim();

    if (!name) {
      Alert.alert('캐릭터 이름 입력', '캐릭터 이름을 입력해주세요.');
      return;
    }

    // 서버가 2~10자만 받는다.
    if (name.length < 2) {
      Alert.alert('캐릭터 이름 입력', '이름은 2자 이상으로 지어주세요.');
      return;
    }

    setSaving(true);
    try {

      await saveCharacter(selectedCharacter, name);


      await saveCharacterName(name);

      if (renew) {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        return;
      }

      navigation.reset({
        index: 0,
        routes: [
        {
          name: 'OnboardingComplete',
          params: {
            character: CHARACTER_DATA[selectedCharacter],
            characterName: name,
          },
        },
      ],
    });
    } catch (error) {
      Alert.alert('저장 실패', getErrorMessage(error, '캐릭터를 저장하지 못했어요'));
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inner}
        >


          {!renew && <ScreenHeader navigation={navigation} />}


          <View style={styles.content}>
            <Text style={styles.title}>
              {renew ? '새 친구를 골라주세요' : '함께할 친구를 골라주세요'}
            </Text>
            <Text style={styles.subtitle}>
              {renew
                ? '지난 캐릭터는 앨범에 보관했어요'
                : '선택한 캐릭터는 온보딩 완료 후 변경할 수 없어요'}
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
                <View style={[
                  styles.imagePlaceholder,
                  selectedCharacter === 'cat' && styles.selectedImagePlaceholder
                ]}>
                  <Image
                    source={CHARACTER_DATA.cat.image}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
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
                <View style={[
                  styles.imagePlaceholder,
                  selectedCharacter === 'dog' && styles.selectedImagePlaceholder
                ]}>
                  <Image
                    source={CHARACTER_DATA.dog.image}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  style={styles.cardText}
                >
                  강아지
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.nameInputContainer}>                    
              <Text style={styles.nameLabel}>캐릭터 이름</Text>         
              <TextInput                                                
                style={styles.nameInput}                                
                value={characterName}                                   
                onChangeText={setCharacterName}                         
                placeholder="캐릭터 이름을 입력해주세요"                
                placeholderTextColor="#8A94A6"                          
                maxLength={10}                                          
              />                                                        
            </View>   

            <TouchableOpacity
              style={[styles.submitButton, saving && styles.submitButtonDisabled]}
              onPress={handleComplete}
              activeOpacity={0.8}
              disabled={saving}
            >
              <Text style={styles.submitButtonText}>{saving ? '저장 중...' : '다음'}</Text>
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
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B1A18',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#1B1A18',
    textAlign: 'center',
    marginBottom: 32,
  },
  cardGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 28,
  },
  card: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#CFCCC9',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: '#3E629F',
    backgroundColor: '#CCDDFF',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
  },
  selectedImagePlaceholder: {
    backgroundColor: '#E6EEFF',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1B1A18',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#3E629F',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedCardText: {                                                   
    color: '#3E629F',                                                   
    fontWeight: '700',                                                  
  },    
  nameInputContainer: {                                                 
    width: '100%',                                                      
    marginBottom: 28,                                                   
  },                                                                    
  nameLabel: {                                                          
    fontSize: 14,                                                       
    color: '#1B1A18',                                                   
    marginBottom: 8,                                                    
    fontWeight: '500',                                                  
  },                                                                    
  nameInput: {                                                          
    backgroundColor: '#F0F5FF',                                         
    borderWidth: 1,                                                     
    borderColor: '#ffffff',                                             
    shadowColor: '#000000',                                             
    shadowOffset: { width: 0, height: 1 },                              
    shadowOpacity: 0.05,                                                
    shadowRadius: 2,                                                    
    elevation: 1.5,                                                     
    borderRadius: 12,                                                   
    height: 48,                                                         
    paddingHorizontal: 16,                                              
    fontSize: 15,                                                       
    color: '#1B1A18',                                                   
  },                                                                    
  submitButtonDisabled: {                                               
    backgroundColor: '#A0A0A0',                                         
  },       
});