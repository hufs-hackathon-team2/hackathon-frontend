import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getActivityDots } from '../../lib/cycle';
import { getDateFormat } from '../../lib/date';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT, RADIUS } from '../../lib/theme';

LocaleConfig.locales.ko = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const DOT_COLORS = {
  log: COLORS.dotLog,
  quest: COLORS.dotQuest,
  both: COLORS.dotBoth,
  today: COLORS.todayBg,
  todayText: COLORS.primary,
};

export default function CycleCalendar({ cycle, logDates = [], questDates = [] }) {
  return (
    <View>
      <View style={styles.card}>
        <Calendar
          current={getDateFormat(cycle.startDate)}
          markedDates={getActivityDots(logDates, questDates, DOT_COLORS)}
          theme={{
            calendarBackground: COLORS.cardWhite,
            textSectionTitleColor: COLORS.text,
            todayTextColor: COLORS.primary,
            arrowColor: COLORS.textSub,
            monthTextColor: COLORS.text,
            dayTextColor: COLORS.text,
            textDayFontFamily: FONT.regular,
            textMonthFontFamily: FONT.semibold,
            textDayHeaderFontFamily: FONT.regular,
            textDayFontSize: 15,
            textMonthFontSize: 16,
            dotStyle: { width: 8, height: 8, borderRadius: 4, marginTop: 2 },
          }}
        />
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: DOT_COLORS.log }]} />
          <Text style={styles.legendText}>PLUS Log 기록</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: DOT_COLORS.quest }]} />
          <Text style={styles.legendText}>퀘스트 성공</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: DOT_COLORS.both }]} />
          <Text style={styles.legendText}>모두 성공!</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardWhite,
    borderRadius: RADIUS.card,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.cardWhite,
    borderRadius: RADIUS.card,
    paddingVertical: 12,
    gap: 14,
    marginTop: 12,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: COLORS.textSub,
  },
});
