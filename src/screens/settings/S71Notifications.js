// ST 02 알림 수신 설정
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';
import { getSettings, updateNotification } from '../../lib/api/settings';

export default function S71Notifications({ navigation }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (key, value) => {
    const before = settings;

    setSettings({ ...settings, [key]: value });

    updateNotification(key, value)
      .catch(() => {
        setSettings(before);
        Alert.alert('설정을 바꾸지 못했어요', '잠시 후 다시 시도해주세요');
      });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !settings) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>설정을 불러오지 못했어요</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>알림 설정</Text>

        <View style={styles.card}>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>재시작 알림</Text>
            <Text style={styles.cardDesc}>휴식기 후 다시 시작할 시기를 안내받습니다</Text>
          </View>

          <Switch
            value={settings.restart_notification}
            onValueChange={(value) => handleToggle('restart_notification', value)}
            trackColor={{ false: COLORS.cardGray, true: COLORS.navigate }}
            thumbColor={COLORS.cardWhite}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>활동 알림</Text>
            <Text style={styles.cardDesc}>새로운 퀘스트 제안과 주간 분석을 안내받습니다</Text>
          </View>

          <Switch
            value={settings.activity_notification}
            onValueChange={(value) => handleToggle('activity_notification', value)}
            trackColor={{ false: COLORS.cardGray, true: COLORS.navigate }}
            thumbColor={COLORS.cardWhite}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  container: {
    paddingHorizontal: SPACE.screen,
    flexGrow: 1,
  },

  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingVertical: 20,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.cardWhite,
    padding: SPACE.card,
    marginBottom: 12,
  },

  cardText: {
    flex: 1,
    marginRight: 12,
  },

  cardTitle: {
    fontFamily: FONT.semibold,
    fontSize: FONT.subbody,
    color: COLORS.text,
    marginBottom: 4,
  },

  cardDesc: {
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACE.screen,
    backgroundColor: COLORS.bg,
  },

  errorText: {
    fontFamily: FONT.regular,
    fontSize: FONT.body,
    color: COLORS.textSub,
  },
});
