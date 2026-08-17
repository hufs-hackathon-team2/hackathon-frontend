import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../lib/theme';

// 뒤로가기만 있는 헤더. 화면 제목은 각 화면 안에서 그린다.
export default function ScreenHeader({ navigation, showBack = true }) {
  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.back}>{'←'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  back: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
