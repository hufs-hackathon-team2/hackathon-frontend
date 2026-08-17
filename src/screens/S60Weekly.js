import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export default function S60Weekly({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [weeklyData, setWeeklyData] = useState(null);

  const cardCaptureRef = useRef(null);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
    try {
      setIsError(false);
      const rawActiveDates = ['2026-08-10', '2026-08-10', '2026-08-12'];
      const activeDaysCount = new Set(rawActiveDates).size;

      const mockResponse = {
        is_generated: true,
        week_start: '2026-08-10',
        week_end: '2026-08-16',
        plus_log_count: 5,
        success_quest_count: 2,
        active_days: activeDaysCount,
        next_week_recommendations: [
          {
            recommendation_id: 1,
            quest_content: '물 하루 8잔 마시기',
            reason: '지난주에도 잘 하셨어요',
          },
          {
            recommendation_id: 2,
            quest_content: '저녁 산책 10분',
            reason: '꾸준히 하면 몸이 달라져요',
          },
        ],
      };

      setWeeklyData(mockResponse);
    } catch (error) {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync(true, ['photo']);

      if (!permission.granted) {
        Alert.alert('권한 필요', '이미지를 저장하려면 사진 저장 권한이 필요합니다.');
        return;
      }

      const uri = await captureRef(cardCaptureRef, {
        format: 'png',
        quality: 0.9,
      });

      await MediaLibrary.saveToLibraryAsync(uri);

      Alert.alert('저장 완료', '위클리 카드가 갤러리에 저장되었습니다.');
    } catch (error) {
      console.error(error);
      Alert.alert('저장 실패', '이미지를 저장하는 중 오류가 발생했습니다.');
    }
  };

  const handleShare = async () => {
    try {
      const uri = await captureRef(cardCaptureRef, {
        format: 'png',
        quality: 0.9,
      });

      const available = await Sharing.isAvailableAsync();

      if (!available) {
        Alert.alert('공유 불가', '이 기기에서는 공유 기능을 사용할 수 없습니다.');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: '이번 주 위클리 카드 공유',
      });
    } catch (error) {
      console.error(error);
      Alert.alert('공유 실패', '이미지 공유 중 오류가 발생했습니다.');
    }
  };

  const handleSelectQuest = (quest) => {
    navigation.navigate('QuestTab', {
      screen: 'QuestList',
      params: {
        newQuest: {
          id: quest.recommendation_id,
          title: quest.quest_content,
        },
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E232C" />
      </View>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>이번 주 위클리 카드</Text>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyMessageText}>
              데이터를 불러올 수 없습니다.{'\n'}잠시 후 다시 시도해 주세요.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!weeklyData || !weeklyData.is_generated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>이번 주 위클리 카드</Text>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyMessageText}>
              이번 주는 기록이 적어 카드를 만들지 못했어요
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>이번 주 위클리 카드</Text>

          <View
            ref={cardCaptureRef}
            collapsable={false}
            style={styles.captureArea}
          >
            <View style={styles.cardBlock}>
              <Text style={styles.blockTitle}>한 주 요약</Text>

              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>PLUS Log</Text>
                  <Text style={styles.summaryValue}>
                    {weeklyData?.plus_log_count}개
                  </Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>성공 퀘스트</Text>
                  <Text style={styles.summaryValue}>
                    {weeklyData?.success_quest_count}개
                  </Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>활동일</Text>
                  <Text style={styles.summaryValue}>
                    {weeklyData?.active_days}일
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardBlock}>
              <Text style={styles.blockTitle}>다음 주 추천 퀘스트</Text>

              <Text style={styles.blockSubTitle}>
                부담 없이 이어갈 수 있는 행동을 골라봤어요
              </Text>

              {weeklyData?.next_week_recommendations.map((quest) => (
                <View
                  key={quest.recommendation_id}
                  style={styles.questItem}
                >
                  <View style={styles.questTextGroup}>
                    <Text style={styles.questTitle}>
                      {quest.quest_content}
                    </Text>

                    <Text style={styles.questReason}>
                      {quest.reason}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => handleSelectQuest(quest)}
                  >
                    <Text style={styles.selectButtonText}>
                      선택
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.cardBlock}>
            <Text style={styles.shareBlockTitle}>
              카드 저장 · 공유
            </Text>

            <Text style={styles.shareBlockSubTitle}>
              이번 주 카드를 간직하거나 공유해보세요
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSaveImage}
              >
                <Text style={styles.actionButtonText}>
                  이미지 저장
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Text style={styles.actionButtonText}>
                  공유하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { flexGrow: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, paddingHorizontal: 20, paddingVertical: 16 },
  screenTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1D1E', marginBottom: 12 },
  
  captureArea: { 
    backgroundColor: '#F8F9FA', 
    paddingHorizontal: 20, 
    marginHorizontal: -20,
    paddingVertical: 10,
  },
  
  cardBlock: { backgroundColor: '#F8F9FA', borderRadius: 16, borderWidth: 1, borderColor: '#EAECEF', padding: 20, marginBottom: 14 },
  blockTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1D1E', marginBottom: 12 },
  blockSubTitle: { fontSize: 14, color: '#525960', marginTop: -6, marginBottom: 18 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { flex: 1 },
  summaryLabel: { fontSize: 12, color: '#525960', marginBottom: 4 },
  summaryValue: { fontSize: 15, fontWeight: 'bold', color: '#1A1D1E' },
  questItem: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#EAECEF', paddingHorizontal: 18, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, minHeight: 82 },
  questTextGroup: { flex: 1 },
  questTitle: { fontSize: 15, fontWeight: '600', color: '#1A1D1E', marginBottom: 6 },
  questReason: { fontSize: 13, color: '#72787F', lineHeight: 19 },
  selectButton: { backgroundColor: '#1E232C', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6 },
  selectButtonText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  shareBlockTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A1D1E', textAlign: 'center', marginBottom: 4 },
  shareBlockSubTitle: { fontSize: 12, color: '#72787F', textAlign: 'center', marginBottom: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  actionButton: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#343A40', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  actionButtonText: { fontSize: 13, fontWeight: '600', color: '#1A1D1E' },
  emptyCard: { backgroundColor: '#F8F9FA', borderRadius: 16, borderWidth: 1, borderColor: '#EAECEF', paddingVertical: 40, paddingHorizontal: 20, alignItems: 'center' },
  emptyMessageText: { fontSize: 15, color: '#72787F', textAlign: 'center' },
});