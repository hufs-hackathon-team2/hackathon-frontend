import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// 패키지 설치 전이라 주석 처리
// import captureRef from 'react-native-view-shot';
// import { CameraRoll } from '@react-native-camera-roll/camera-roll';

export default function WeeklyCardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState(null);
  const [selectedQuestIds, setSelectedQuestIds] = useState([]);

  const cardCaptureRef = useRef(null);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
    try {
      const mockResponse = {
        is_generated: true, // false로 설정 시 미생성 화면
        week_start: '2026-08-10',
        week_end: '2026-08-16',
        plus_log_count: 5,
        success_quest_count: 2,
        active_days: 4,
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
          {
            recommendation_id: 3,
            quest_content: '아침 스트레칭',
            reason: '짧아도 매일이면 충분해요',
          },
        ],
      };

      setWeeklyData(mockResponse);
    } catch (error) {
      console.error('위클리 카드 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestSelection = (id) => {
    if (selectedQuestIds.includes(id)) {
      setSelectedQuestIds(selectedQuestIds.filter((item) => item !== id));
    } else {
      setSelectedQuestIds([...selectedQuestIds, id]);
    }
  };

  const handleConfirmQuests = () => {
    if (selectedQuestIds.length === 0) {
      Alert.alert('알림', '신규 퀘스트를 하나 이상 선택해 주세요.');
      return;
    }
    Alert.alert(
      '선택 완료',
      `${selectedQuestIds.length}개의 퀘스트가 선택되었습니다.`
    );
  };

  const handleSaveImage = async () => {
    try {
      // captureRef 동작 구현부
      Alert.alert('알림', '패키지 설치 후 동작합니다.');
    } catch (error) {
      console.error('이미지 저장 실패:', error);
    }
  };

  const handleShare = async () => {
    try {
      Alert.alert('알림', '패키지 설치 후 동작합니다.');
    } catch (error) {
      console.error('이미지 공유 실패:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E232C" />
      </View>
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
      <View style={styles.container}>
        <Text style={styles.screenTitle}>이번 주 위클리 카드</Text>

        <View ref={cardCaptureRef} collapsable={false} style={styles.captureArea}>
          <View style={styles.cardBlock}>
            <Text style={styles.blockTitle}>한 주 요약</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>PLUS Log</Text>
                <Text style={styles.summaryValue}>
                  {weeklyData.plus_log_count}개
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>성공 퀘스트</Text>
                <Text style={styles.summaryValue}>
                  {weeklyData.success_quest_count}개
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>활동일</Text>
                <Text style={styles.summaryValue}>
                  {weeklyData.active_days}일
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardBlock}>
            <Text style={styles.blockTitle}>다음 주 추천 퀘스트</Text>
            <Text style={styles.blockSubTitle}>
              부담 없이 이어갈 수 있는 행동을 골라봤어요
            </Text>

            {weeklyData.next_week_recommendations.map((quest) => {
              const isSelected = selectedQuestIds.includes(
                quest.recommendation_id
              );
              return (
                <View key={quest.recommendation_id} style={styles.questItem}>
                  <View style={styles.questTextGroup}>
                    <Text style={styles.questTitle}>{quest.quest_content}</Text>
                    <Text style={styles.questReason}>{quest.reason}</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.selectButton,
                      isSelected && styles.selectButtonActive,
                    ]}
                    onPress={() => toggleQuestSelection(quest.recommendation_id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.selectButtonText,
                        isSelected && styles.selectButtonTextActive,
                      ]}
                    >
                      {isSelected ? '선택됨' : '선택'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmQuests}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>추천 퀘스트 확인하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardBlock}>
          <Text style={styles.shareBlockTitle}>카드 저장 · 공유</Text>
          <Text style={styles.shareBlockSubTitle}>
            이번 주 카드를 간직하거나 공유해보세요
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSaveImage}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>이미지 저장</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>공유하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1D1E',
    marginBottom: 12,
  },
  captureArea: {
    backgroundColor: '#F8F9FA',
  },
  cardBlock: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAECEF',
    padding: 16,
    marginBottom: 12,
  },
  blockTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1D1E',
    marginBottom: 12,
  },
  blockSubTitle: {
    fontSize: 13,
    color: '#525960',
    marginTop: -8,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#525960',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1D1E',
  },
  questItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAECEF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  questTextGroup: {
    flex: 1,
    paddingRight: 8,
  },
  questTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1D1E',
    marginBottom: 2,
  },
  questReason: {
    fontSize: 11,
    color: '#72787F',
  },
  selectButton: {
    backgroundColor: '#F1F3F5',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  selectButtonActive: {
    backgroundColor: '#1E232C',
  },
  selectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#343A40',
  },
  selectButtonTextActive: {
    color: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#1E232C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  shareBlockTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1D1E',
    textAlign: 'center',
    marginBottom: 4,
  },
  shareBlockSubTitle: {
    fontSize: 12,
    color: '#72787F',
    textAlign: 'center',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1D1E',
  },
  emptyCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAECEF',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyMessageText: {
    fontSize: 15,
    color: '#72787F',
    textAlign: 'center',
  },
});