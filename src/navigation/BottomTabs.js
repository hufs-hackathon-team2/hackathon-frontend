// 화면 아래쪽에 항상 붙어있는 탭 5개 — 홈 · 기록 · 퀘스트 · 사이클 · 설정

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, FONT } from '../lib/theme';

import S20CharacterRoom from '../screens/home/S20CharacterRoom';
import S21LogNew from '../screens/log/S21LogNew';
import S22LogList from '../screens/log/S22LogList';
import S31CycleAnalysis from '../screens/cycle/S31CycleAnalysis';
import S32CycleHistory from '../screens/cycle/S32CycleHistory';
import S50QuestList from '../screens/quest/S50QuestList';
import S51QuestCreate from '../screens/quest/S51QuestCreate';
import S70Settings from '../screens/settings/S70Settings';
import S71Notifications from '../screens/settings/S71Notifications';
import S72ServiceInfo from '../screens/settings/S72ServiceInfo';
import S73Withdraw from '../screens/settings/S73Withdraw';
import S40Resume from '../screens/S40Resume';


const ICONS = {
  HomeTab: 'home',
  LogTab: 'document-text',
  QuestTab: 'flag',
  CycleTab: 'calendar',
  SettingsTab: 'settings',
};


const LogStackNav = createNativeStackNavigator();
function LogStack() {
  return (
    <LogStackNav.Navigator screenOptions={{ headerShown: false }}>
      <LogStackNav.Screen name="LogList" component={S22LogList} />
      <LogStackNav.Screen name="LogNew" component={S21LogNew} />

    </LogStackNav.Navigator>
  );
}

const QuestStackNav = createNativeStackNavigator();
function QuestStack() {
  return (
    <QuestStackNav.Navigator screenOptions={{ headerShown: false }}>
      <QuestStackNav.Screen name="QuestList" component={S50QuestList} />
      <QuestStackNav.Screen name="QuestCreate" component={S51QuestCreate} />

    </QuestStackNav.Navigator>
  );
}

const CycleStackNav = createNativeStackNavigator();
function CycleStack() {
  return (
    <CycleStackNav.Navigator screenOptions={{ headerShown: false }}>
      
      <CycleStackNav.Screen
        name="CycleAnalysis"
        component={S31CycleAnalysis}
        options={{ headerShown: false}}
      />
      <CycleStackNav.Screen name="CycleHistory" component={S32CycleHistory} />
    </CycleStackNav.Navigator>
  );
}

const SettingsStackNav = createNativeStackNavigator();
function SettingsStack() {
  return (
    <SettingsStackNav.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStackNav.Screen name="SettingsHome" component={S70Settings} />
      <SettingsStackNav.Screen name="Notifications" component={S71Notifications} />
      <SettingsStackNav.Screen name="ServiceInfo" component={S72ServiceInfo} />
      <SettingsStackNav.Screen name="Withdraw" component={S73Withdraw} />
    </SettingsStackNav.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={focused ? ICONS[route.name] : `${ICONS[route.name]}-outline`}
            size={18}
            color={color}
          />
        ),

        tabBarActiveTintColor: COLORS.navigate,
        tabBarInactiveTintColor: COLORS.textSub,

        tabBarLabelStyle: {
          fontFamily: FONT.regular,
          fontSize: 11,
        },

        tabBarStyle: {
          backgroundColor: COLORS.cardAlt,
          borderTopWidth: 1,
          borderTopColor: COLORS.disabled,
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={S20CharacterRoom} options={{ title: '홈' }} />
      <Tab.Screen name="LogTab" component={LogStack} options={{ title: 'PLUS Log' }} />
      <Tab.Screen name="QuestTab" component={QuestStack} options={{ title: '퀘스트' }} />
      <Tab.Screen name="CycleTab" component={CycleStack} options={{ title: '사이클' }} />
      <Tab.Screen name="SettingsTab" component={SettingsStack} options={{ title: '설정' }} />
    </Tab.Navigator>
  );
}
