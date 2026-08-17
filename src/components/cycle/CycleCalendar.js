import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getCycleMarks, getRestMarks, mergeMarks, getActivityDots } from '../../lib/cycle';
import { getDateFormat } from '../../lib/date';
import { View, Text, StyleSheet } from 'react-native';


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
  log: '#FFFFFF',
  quest: '#E8C547',
  both: '#8CB369',
};


export default function CycleCalendar({ cycle, logDates = [], questDates = [], color = '#4A6B4E', restColor = '#C9CCC0'}) {
  return (
    <View>
      <Calendar
        markingType="period"
        current={getDateFormat(cycle.startDate)}
        markedDates={mergeMarks(
          getCycleMarks(cycle, color),
          getRestMarks(cycle, logDates, restColor),
          getActivityDots(logDates, questDates, DOT_COLORS),
        )}
        theme={{
          calendarBackground: 'transparent',
          todayTextColor: '#4A6B4E',
          arrowColor: '#4A6B4E',
          monthTextColor: '#242A24',
          textDayFontSize: 15,
          textMonthFontWeight: 'bold',
        }}
      />

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: DOT_COLORS.log }]} />
          <Text style={styles.legendText}>PLUS Log</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: DOT_COLORS.quest }]} />
          <Text style={styles.legendText}>퀘스트</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: DOT_COLORS.both }]} />
          <Text style={styles.legendText}>둘 다</Text>
        </View>
  
        <View style={styles.legendItem}>
          <View style={[styles.bar, { backgroundColor: color }]} />
          <Text style={styles.legendText}>활동기</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.bar, { backgroundColor: restColor }]} />
          <Text style={styles.legendText}>휴식기</Text>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    marginTop: 10,
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
    borderWidth: 1,
    borderColor: '#DDD',
  },
  bar: {
    width: 16,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});
