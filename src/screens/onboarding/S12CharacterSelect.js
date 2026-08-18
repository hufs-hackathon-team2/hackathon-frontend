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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';

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

export default function S12CharacterSelect({ navigation }) {
  const [selectedCharacter, setSelectedCharacter] = useState('cat');

  const handleComplete = () => {
    const selectedCharacterObj = CHARACTER_DATA[selectedCharacter];

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'OnboardingComplete',
          params: {
            character: selectedCharacterObj,
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inner}
        >

          <ScreenHeader navigation={navigation} />


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
                <View style={[
                  styles.imagePlaceholder,
                  selectedCharacter === 'cat' && styles.selectedImagePlaceholder
                ]}>
                  <Image
                    source={CHARACTER_DATA.cat.image}
                    style={[
                            styles.cardImage,
                            { 
                              transform: [
                                { scale: 1.1 },  
                                { translateX: 13 },   
                                { translateY: -5},
                              ] 
                            }
                          ]}
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


            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>다음</Text>
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
  header: {
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 20,
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
});