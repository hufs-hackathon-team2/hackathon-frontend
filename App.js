// 앱의 화면 목록과 이동 경로를 정의하는 파일
// 명세서 화면 구조도(S00~S70)를 그대로 옮겨놨고, 화면 19개가 전부 등록
// 새 화면을 추가할 일이 아니면 여기는 건드리지 않아도 됨

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import S00Splash from './src/screens/auth/S00Splash';
import S01Login from './src/screens/auth/S01Login';
import S02Signup from './src/screens/auth/S02Signup';
import S03ResetPassword from './src/screens/auth/S03ResetPassword';

import S11Interests from './src/screens/onboarding/S11Interests';
import S12CharacterSelect from './src/screens/onboarding/S12CharacterSelect';
import S13Complete from './src/screens/onboarding/S13Complete';

import S20CharacterRoom from './src/screens/home/S20CharacterRoom';
import S21LogNew from './src/screens/home/S21LogNew';
import S22LogList from './src/screens/home/S22LogList';

import S30CycleCalendar from './src/screens/cycle/S30CycleCalendar';
import S31CycleAnalysis from './src/screens/cycle/S31CycleAnalysis';
import S32CycleHistory from './src/screens/cycle/S32CycleHistory';

import S50QuestList from './src/screens/quest/S50QuestList';
import S51QuestCreate from './src/screens/quest/S51QuestCreate';
import S52QuestProgress from './src/screens/quest/S52QuestProgress';

import S70Settings from './src/screens/settings/S70Settings';

import S40Resume from './src/screens/S40Resume';
import S60Weekly from './src/screens/S60Weekly';

const Tab = createBottomTabNavigator();

// 화면 아래쪽에 항상 붙어있는 탭 4개
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={S20CharacterRoom} options={{ title: '홈' }} />
      <Tab.Screen name="CycleTab" component={S30CycleCalendar} options={{ title: '사이클' }} />
      <Tab.Screen name="QuestTab" component={S50QuestList} options={{ title: '퀘스트' }} />
      <Tab.Screen name="SettingsTab" component={S70Settings} options={{ title: '설정' }} />
    </Tab.Navigator>
  );
}


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          {/*시작 */}
          <Stack.Screen name="Splash" component={S00Splash} />

          {/*로그인*/}
          <Stack.Screen name="Login" component={S01Login} />
          <Stack.Screen name="Signup" component={S02Signup} />
          <Stack.Screen name="ResetPassword" component={S03ResetPassword} />

          {/*온보딩*/}
          <Stack.Screen name="Interests" component={S11Interests} />
          <Stack.Screen name="CharacterSelect" component={S12CharacterSelect} />
          <Stack.Screen name="OnboardingComplete" component={S13Complete} />

          {/*하단 탭*/}
          <Stack.Screen name="Main" component={MainTabs} />

          {/*탭에서눌러서 들어가는 화면*/}
          <Stack.Screen
            name="LogNew"
            component={S21LogNew}
            options={{ headerShown: true, title: '기록 입력' }}
          />
          <Stack.Screen
            name="LogList"
            component={S22LogList}
            options={{ headerShown: true, title: '이번 사이클 기록' }}
          />
          <Stack.Screen
            name="CycleAnalysis"
            component={S31CycleAnalysis}
            options={{ headerShown: true, title: '분석 결과' }}
          />
          <Stack.Screen
            name="CycleHistory"
            component={S32CycleHistory}
            options={{ headerShown: true, title: '히스토리' }}
          />
          <Stack.Screen
            name="QuestCreate"
            component={S51QuestCreate}
            options={{ headerShown: true, title: '직접 만들기' }}
          />
          <Stack.Screen
            name="QuestProgress"
            component={S52QuestProgress}
            options={{ headerShown: true, title: '진행 상황' }}
          />

          {/*팝업 화면*/}
          <Stack.Screen
            name="Resume"
            component={S40Resume}
            options={{ headerShown: true, title: '재개', presentation: 'modal' }}
          />
          <Stack.Screen
            name="Weekly"
            component={S60Weekly}
            options={{ headerShown: true, title: '위클리 카드', presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
