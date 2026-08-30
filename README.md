# healply

헬시 플레저를 오래 이어가도록 돕는 모바일 앱입니다.

기록을 남기면 캐릭터가 자라고, 기록이 끊기면 사이클이 휴식기로 넘어갑니다.
다시 돌아온 순간을 실패가 아니라 새 사이클의 시작으로 다루는 것이 이 서비스의 핵심입니다.

기능 상세는 `기능명세서.pdf` 를 참고하세요.

2026년 8월에 진행한 해커톤 프로젝트입니다. 개발은 마무리되었습니다.

## 기술 스택

- Expo SDK 54, React Native 0.81, JavaScript
- React Navigation 7 (하단 탭 + 네이티브 스택)
- axios — 서버 통신
- expo-secure-store — 토큰 보관
- react-native-calendars — 사이클 달력
- react-native-view-shot, expo-media-library, expo-sharing — 위클리 카드 저장·공유
- expo-font, expo-linear-gradient


## 시작하기

```bash
git clone https://github.com/hufs-hackathon-team2/hackathon-frontend.git
cd hackathon-frontend
npm ci
```

## 실행

휴대폰에 Expo Go 를 설치하고, PC와 같은 Wi-Fi에 연결합니다.

```bash
npx expo start
```

터미널에 QR코드와 함께 `exp://<IP>:8081` 주소가 나옵니다.

- iOS: 기본 카메라로 QR을 비추거나, Expo Go의 `Enter URL manually` 에 주소를 직접 입력
- Android: Expo Go 앱의 `Scan QR code`

패키지를 새로 설치했을 때만 `npx expo start -c` 로 캐시를 지우고 시작하세요.
평소에 붙이면 매번 처음부터 다시 빌드해서 느려집니다.

### 첫 실행이 오래 걸립니다

Metro는 누가 요청하기 전까지 번들을 만들지 않습니다. `npx expo start` 가 끝나도
그때는 아직 아무것도 만들어지지 않은 상태이고, Expo Go 로 처음 접속하는 순간
전체 번들을 한 번에 만듭니다. 그래서 첫 화면이 뜨기까지 1~2분이 걸립니다.

두 번째부터는 바뀐 부분만 다시 만들어서 훨씬 빠릅니다. 첫 접속이 느린 것은
고장이 아니니 기다리면 됩니다.

## 앱으로 빌드하기

Expo Go 없이 설치해서 쓰려면 EAS 로 안드로이드 APK 를 만듭니다.

```bash
npx eas build --platform android --profile preview
```

빌드가 끝나면 설치용 링크와 QR 이 나옵니다. `preview` 프로파일은 `eas.json` 에
`buildType: apk` 로 잡혀 있어서 스토어를 거치지 않고 바로 설치할 수 있습니다.

EAS 가 보관하는 빌드 결과물은 30일 뒤 만료되어 링크가 닫힙니다. 계속 필요하면
APK 파일을 따로 내려받아 두거나 다시 빌드하세요.


## 폴더 구조

```
App.js                     인증 · 온보딩 · 팝업 화면의 이동 경로
src/
  navigation/
    BottomTabs.js          하단 탭 5개와 각 탭의 하위 화면
  screens/                 화면 하나당 파일 하나
    auth/                  S00 S01 S02 S03 S04 Welcome
    onboarding/            S11 S12 S13
    home/                  S20 S80 S81
    log/                   S21 S22
    quest/                 S50 S51 S52
    cycle/                 S31 S32 S33
    settings/              S70 S71 S72 S73
    S40Resume.js           재개 화면 (팝업)
    S60Weekly.js           위클리 카드 (팝업)
  components/
    common/                ScreenHeader 등 공용 조각
    home/                  CharacterRoomCard — 홈과 위클리 카드가 함께 쓰는 캐릭터 방
    cycle/                 CycleCalendar, AnalysisBoxes
    log/ quest/
  lib/
    api/                   서버 호출. 모듈 하나가 기능 하나를 맡는다
    date.js                날짜 · 시간 계산 (KST 기준)
    assets.js              스티커 · 캐릭터 이미지 목록
    theme.js               색 · 글꼴 · 여백
    score.js               성장 점수 규칙
    useDelayedBusy.js      짧은 응답에는 스피너를 띄우지 않는 훅
```

`lib/` 에는 화면과 서버를 모르는 순수 함수만 둡니다. 화면 없이도 동작을 확인할 수
있어야 하는 계산이 여기에 옵니다.

팝업으로 뜨는 화면(S33 · S40 · S52 · S60 · S80)은 탭 바까지 덮어야 해서 `App.js` 에
등록돼 있습니다. 나머지 하위 화면은 각 탭 안에 있어서 이동해도 탭 바가 유지됩니다.

## 화면 목록

| ID  | 화면 | 기능 |
| --- | --- | --- |
| S00 | 스플래시 | AU 03 |
| S01 | 로그인 | AU 02 |
| S02 | 회원가입 | AU 01 |
| S03 | 비밀번호 재설정 | AU 05 |
| S04 | 회원가입 완료 | AU 01 |
| S11 | 관심 영역 선택 | ON 01 |
| S12 | 캐릭터 선택 | ON 02 |
| S13 | 온보딩 완료 | ON 03 |
| S20 | 캐릭터 방 (홈) | CH 01, CH 03 |
| S21 | 기록 입력 | LG 01 |
| S22 | 이번 사이클 기록 | LG 03, LG 04 |
| S31 | 사이클 분석 (사이클 탭 첫 화면) | CY 02, CY 03, CY 04 |
| S32 | 사이클 히스토리 | CY 06 |
| S33 | 지난 사이클 분석 (팝업) | CY 06 |
| S40 | 재개 화면 (팝업) | CY 05 |
| S50 | 퀘스트 리스트 · 진행 중 퀘스트 | QS 01, QS 03 |
| S51 | 퀘스트 직접 만들기 | QS 02 |
| S52 | 퀘스트 완료 축하 (팝업) | QS 03 |
| S60 | 위클리 카드 (팝업) | WK 01 |
| S70 | 설정 | ST 01, AU 04 |
| S71 | 알림 설정 | ST 02 |
| S72 | 서비스 안내 | ST 01 |
| S73 | 회원 탈퇴 | AU 06 |
| S80 | 캐릭터 완성 축하 (팝업) | CH 04 |
| S81 | 캐릭터 앨범 | CH 04 |

명세서와 달라진 점이 있습니다.

- S30 사이클 달력은 없앴습니다. 달력은 S31 안에 들어갔고, 완료한 사이클은
  S32 히스토리에서 카드를 눌러 S33 팝업으로 봅니다.



## 서버 연동

```js
// src/lib/api/client.js
export const BASE_URL = "https://meotjinsaja.shop";
export const USE_MOCK = false;
```

`USE_MOCK` 을 `true` 로 두면 서버 없이 `src/lib/api/mock/` 의 가짜 데이터로 화면을
확인할 수 있습니다. 서버가 내려갔을 때도 이 값으로 화면을 볼 수 있습니다.
**커밋할 때는 `false` 여야 합니다.**

API 요청과 응답은 개발 빌드에서만 콘솔에 찍힙니다.

```bash
adb logcat | grep "\[API\]"
```

로그인 응답의 토큰은 가려서 출력합니다.

### 알아둘 점

- 주소 끝의 `/` 를 빼면 Django 가 리다이렉트하면서 요청이 깨집니다
- 로그인·회원가입 요청에는 토큰을 붙이지 않습니다. 만료된 토큰이 남아 있으면
  로그인 자체가 401 로 막혀 빠져나올 수 없습니다
- 서버 오류 문구는 `lib/api/error.js` 를 거쳐 한국어로 바뀝니다.
  옮기지 못한 영어는 사용자에게 보여주지 않습니다


## 브랜치와 PR

개발 기간에 지킨 규칙입니다. 이어서 작업할 때도 그대로 따르면 됩니다.

`main` 은 발표와 시연에 쓰는 브랜치라 항상 동작하는 상태로 둡니다.
평소 작업은 `dev` 에서 갈라져 나와 `dev` 로 다시 합칩니다.

```
main            시연 · 제출용. dev 에서만 머지
dev             기본 작업 브랜치
feature/...     개인 작업 브랜치
```

clone 한 뒤에는 `dev` 로 옮겨서 시작하세요.

```bash
git switch dev
```

### 작업 순서

기능 하나에 브랜치 하나를 만듭니다. 브랜치 이름에는 명세서의 기능 ID를 넣습니다.

```bash
git switch dev
git pull
git switch -c feature/AU01-signup
```

작업이 끝나면 push 하고 GitHub에서 `dev` 로 PR을 올립니다.

```bash
git add .
git commit -m "[AU 01] 회원가입 화면 UI 구현"
git push -u origin feature/AU01-signup
```

### PR 규칙

- 대상 브랜치는 `dev` 입니다. `main` 으로 바로 올리지 않습니다.
- 제목에 기능 ID를 넣습니다. 예: `[LG 01] PLUS Log 입력 화면`
- 본문은 `.github/PULL_REQUEST_TEMPLATE.md` 형식을 따릅니다.
- 팀원 한 명 이상이 확인한 뒤 머지합니다.

### 충돌이 났을 때

PR에 충돌 표시가 뜨면 `dev` 를 자기 브랜치로 가져와서 해결한 뒤 다시 push 합니다.

```bash
git switch feature/AU01-signup
git pull origin dev
# 충돌난 파일 수정
git add .
git commit
git push
```

작업을 시작하기 전에 `git pull` 로 `dev` 를 최신으로 맞춰두면 충돌이 훨씬 줄어듭니다.

