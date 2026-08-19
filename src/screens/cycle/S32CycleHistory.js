// CY 06 사이클 히스토리 (P1)
import { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/common/ScreenHeader';
import { getFullDate, getDurationDays, EMPTY_DATE } from "../../lib/date";
import { COLORS, FONT, SPACE, RADIUS } from '../../lib/theme';
import { getCycleHistory } from '../../lib/api/cycles';


export default function S32CycleHistory({ navigation }) {

  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);

    getCycleHistory()
      .then(setCycles)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();

    // 실패한 채로 남지 않도록 화면에 들어올 때마다 다시 불러온다
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const completed = (cycles ?? []).filter((cycle) => cycle.started_at && cycle.closed_at);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader navigation={navigation} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.historyTitle}>Healthy Cycle 히스토리</Text>

        <Text style={styles.historySub}>지금까지 쌓아온 나의 건강 흐름이에요</Text>

        {error ? (
          <Text style={styles.errorText}>히스토리를 불러오지 못했어요</Text>
        ) : completed.length === 0 ? (
          <Text style={styles.errorText}>아직 완료한 사이클이 없어요</Text>
        ) : (
          completed.map((cycle) => (
            <View key={cycle.cycle_id} style={styles.historyBox}>
              <Text style={styles.historyNth}>{cycle.cycle_count}번째 사이클</Text>
              <Text style={styles.historyPeriod}>
                {getFullDate(cycle.started_at)} ~ {getFullDate(cycle.closed_at)}
              </Text>
              <Text style={styles.historySummary}>
                {getDurationDays(cycle.started_at, cycle.closed_at) ?? EMPTY_DATE}일 동안 이어갔어요
              </Text>
            </View>
          ))
        )}

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
    backgroundColor: COLORS.bg,
    flexGrow: 1,
  },

  historyTitle: {
    fontFamily: FONT.bold,
    fontSize: FONT.title,
    color: COLORS.text,
    paddingVertical: 15,
  },

  historySub:{
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.textSub,
    marginBottom: 20,
  },

  historyBox:{
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.card,
    backgroundColor: COLORS.cardWhite,
  },

  historyNth:{
    fontFamily: FONT.semibold,
    fontSize: FONT.cardTitle,
    color: COLORS.text,
    paddingBottom: 5,
    paddingTop: 2,
  },

  historyPeriod:{
    fontFamily: FONT.regular,
    fontSize: FONT.body,
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
    textAlign: 'center',
    paddingVertical: 40,
  },

  historySummary:{
    fontFamily: FONT.regular,
    fontSize: FONT.caption,
    color: COLORS.text,
    marginTop: 6,
  },
});
