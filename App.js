import { useFonts } from 'expo-font';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONT } from './src/lib/theme';

import BottomTabs from './src/navigation/BottomTabs';

import S00Splash from './src/screens/auth/S00Splash';
import Welcome from './src/screens/auth/Welcome';
import S01Login from './src/screens/auth/S01Login';
import S02Signup from './src/screens/auth/S02Signup';
import S03ResetPassword from './src/screens/auth/S03ResetPassword';

import S11Interests from './src/screens/onboarding/S11Interests';
import S12CharacterSelect from './src/screens/onboarding/S12CharacterSelect';
import S13Complete from './src/screens/onboarding/S13Complete';

import S52QuestProgress from './src/screens/quest/S52QuestProgress';

import S40Resume from './src/screens/S40Resume';
import S60Weekly from './src/screens/S60Weekly';
import S04SignupComplete from './src/screens/auth/S04SignupComplete';

const Stack = createNativeStackNavigator();

const modalOptions = {
  presentation: 'modal',
  headerShown: true,
  headerStyle: { backgroundColor: COLORS.bg },
  headerTitleStyle: { fontFamily: FONT.semibold, fontSize: FONT.body, color: COLORS.text },
  headerShadowVisible: false,
  headerTintColor: COLORS.text,
};

export default function App() {
  
  const [loaded] = useFonts({
    AstaSans: require('./assets/fonts/AstaSans-Regular.ttf'),
    AstaSansSemiBold: require('./assets/fonts/AstaSans-SemiBold.ttf'),
    AstaSansBold: require('./assets/fonts/AstaSans-Bold.ttf'),
  });

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          {/*시작 */}
          <Stack.Screen name="Splash" component={S00Splash} />
          <Stack.Screen name="Welcome" component={Welcome} />

          {/*로그인*/}
          <Stack.Screen name="Login" component={S01Login} />
          <Stack.Screen name="Signup" component={S02Signup} />
          <Stack.Screen name="ResetPassword" component={S03ResetPassword} />
          <Stack.Screen name= "SignupComplete" component={S04SignupComplete}/>

          {/*온보딩*/}
          <Stack.Screen name="Interests" component={S11Interests} />
          <Stack.Screen name="CharacterSelect" component={S12CharacterSelect} />
          <Stack.Screen name="OnboardingComplete" component={S13Complete} />

          {/*하단 탭*/}
          <Stack.Screen name="Main" component={BottomTabs} />

          {/*팝업 화면 — 탭 바까지 덮어야 해서 여기 둔다*/}
          <Stack.Screen
            name="QuestProgress"
            component={S52QuestProgress}
            options={{ ...modalOptions, title: '퀘스트 완료' }}
          />
          <Stack.Screen
            name="Resume"
            component={S40Resume}
            options={{ ...modalOptions, title: '새 사이클 시작' }}
          />
          <Stack.Screen
            name="Weekly"
            component={S60Weekly}
            options={{ ...modalOptions, title: 'Weekly Card' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
