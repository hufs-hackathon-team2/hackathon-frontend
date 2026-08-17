import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../lib/theme';

export default function ScreenHeader({ title, navigation, showBack = true }) {

  return (
    <>
      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.back}>{'<'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <Text style={styles.title}>{title}</Text>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.divider} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  back: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    width: 20,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
