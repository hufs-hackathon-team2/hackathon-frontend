# healply

헬시 플레져를 오래 이어가도록 돕는 모바일 앱입니다.

기록을 남기면 캐릭터가 자라고, 기록이 끊기면 사이클이 휴식기로 넘어갑니다.
다시 돌아온 순간을 실패가 아니라 새 사이클의 시작으로 다루는 것이 이 서비스의 핵심입니다.

기능 상세는 `기능명세서.pdf` 를 참고하세요.

## 기술 스택

- Expo SDK 54, React Native 0.81
- React Navigation 7
- JavaScript


## 시작하기

```bash
git clone <저장소 주소>
cd hackathon-frontend
npm ci
cp .env.example .env
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

Metro는 누가 요청하기 전까지 번들을 만들지 않습니다. 그래서 휴대폰이 접속하는 순간
빌드가 시작되는데, 첫 빌드는 2분 가까이 걸려서 Expo Go가 기다리지 못하고
`There was a problem running the requested app` 을 띄우는 경우가 있습니다.

터미널을 하나 더 열어서 미리 빌드시켜두면 해결됩니다.

```bash
curl -s -o /dev/null -w "%{http_code} %{time_total}s\n" --max-time 300 \
  "http://127.0.0.1:8081/index.bundle?platform=ios&dev=true"
```

안드로이드는 `platform=android` 로 바꿔서 실행하세요. iOS와 안드로이드는 캐시가 따로
관리돼서 한쪽을 예열해도 다른 쪽에는 적용되지 않습니다.

`200` 이 찍히면 휴대폰에서 접속합니다. 이후로는 바로 뜹니다.


## 폴더 구조

```
App.js                     인증 · 온보딩 · 팝업 화면의 이동 경로
src/
  navigation/
    BottomTabs.js          하단 탭 5개와 각 탭의 하위 화면
  screens/                 화면 하나당 파일 하나
    auth/                  S00 S01 S02 S03
    onboarding/            S11 S12 S13
    home/                  S20
    log/                   S21 S22
    quest/                 S50 S51
    cycle/                 S30 S31 S32
    settings/              S70
    S40Resume.js           재개 화면 (팝업)
    S52QuestProgress.js    퀘스트 완료 축하 (팝업)
    S60Weekly.js           위클리 카드 (팝업)
  components/
    common/                여러 화면에서 함께 쓰는 조각
    character/ log/ cycle/ quest/
  lib/
    date.js                날짜 · 시간 계산 (KST 기준)
```

`screens` 아래 폴더는 하단 탭 순서와 같습니다.

```
홈 · 기록 · 퀘스트 · 사이클 · 설정
```

팝업으로 뜨는 화면(S40 · S52 · S60)은 탭 바까지 덮어야 해서 `App.js` 에 등록돼 있습니다.
나머지 하위 화면은 각 탭 안에 있어서 이동해도 탭 바가 유지됩니다.

`lib/` 에는 화면과 서버를 모르는 순수 함수만 둡니다. 화면 없이도 동작을 확인할 수
있어야 하는 계산이 여기에 옵니다.

## 화면 목록

| ID  | 화면 | 기능 |
| --- | --- | --- |
| S00 | 스플래시 | AU 03 |
| S01 | 로그인 | AU 02 |
| S02 | 회원가입 | AU 01 |
| S03 | 비밀번호 재설정 | AU 05 |
| S11 | 관심 영역 선택 | ON 01 |
| S12 | 캐릭터 선택 | ON 02 |
| S13 | 온보딩 완료 | ON 03, NT 00 |
| S20 | 캐릭터 방 (홈) | CH 01, CH 03 |
| S21 | 기록 입력 | LG 01 |
| S22 | 이번 사이클 기록 | LG 03, LG 04 |
| S30 | 사이클 달력 | CY 02 |
| S31 | 사이클 분석 결과 | CY 03, CY 04 |
| S32 | 사이클 히스토리 | CY 06 |
| S40 | 재개 화면 | CY 05 |
| S50 | 퀘스트 리스트 · 진행 중 퀘스트 | QS 01, QS 03 |
| S51 | 퀘스트 직접 만들기 | QS 02 |
| S52 | 퀘스트 완료 축하 | QS 03 |
| S60 | 위클리 카드 | WK 01, WK 02 |
| S70 | 설정 | ST 01, ST 02, AU 04, AU 06 |

S23(진행 중 퀘스트 바)은 별도 화면이 아니라 S20 홈 화면 안에 들어가는 컴포넌트입니다.

명세서와 달라진 점이 있습니다. S52는 원래 "진행 상황(3일 체크리스트)" 화면이었는데,
체크와 포기를 S50에서 처리하기로 하면서 완료 축하 팝업으로 바꿨습니다.

아직 만들지 않은 화면은 `Placeholder` 컴포넌트로 채워져 있습니다. 담당 화면을 맡으면
그 파일의 `Placeholder` 를 실제 UI로 바꾸면 됩니다.

## 작업 규칙

**App.js는 건드리지 않습니다.** 화면 19개가 이미 전부 등록돼 있습니다. 여러 명이 같은
파일을 고치면 매번 충돌이 나기 때문에, 새 화면을 추가해야 하는 경우에만 팀에 공유하고
수정하세요.

**자기가 맡은 화면 파일만 수정합니다.** 공용으로 쓸 컴포넌트를 만들었다면
`components/common` 에 두고 팀에 알려주세요.


## 브랜치와 PR

`main` 은 발표와 시연에 쓰는 브랜치라 항상 동작하는 상태로 둡니다.
평소 작업은 `dev` 에서 갈라져 나와 `dev` 로 다시 합칩니다.

```
main            시연용. dev 에서만 머지
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

브랜치 이름 예시입니다.

- `feature/AU01-signup`
- `feature/LG01-log-input`
- `feature/CY02-cycle-calendar`
- `fix/S20-growth-bar` (버그 수정)

### PR 규칙

- 대상 브랜치는 `dev` 입니다. `main` 으로 바로 올리지 않습니다.
- 제목에 기능 ID를 넣습니다. 예: `[LG 01] PLUS Log 입력 화면`
- 본문에는 무엇을 했는지, 확인이 필요한 부분이 있는지 적습니다. 화면 작업이면 스크린샷을 붙여주세요.
- 팀원 한 명 이상이 확인한 뒤 머지합니다.
- 머지한 브랜치는 삭제합니다.

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
`App.js` 처럼 여러 명이 함께 쓰는 파일은 특히 충돌이 잘 나니 되도록 열지 마세요.


## 백엔드 연동

백엔드는 개발 중이고 API 명세서는 아직 나오지 않았습니다. 그전까지는 화면 안에서가짜 데이터로 작업합니다.

명세서가 나오면 확인이 필요한 항목입니다.

- 토큰 방식 (access/refresh 여부, 만료 시간, 갱신 엔드포인트)
- 기록 저장 후 AI 키워드 추출 결과를 어떻게 받는지 (응답을 기다리는지, 나중에 조회하는지)
- 위클리 카드와 사이클 분석 같은 배치 결과의 조회 방법
- 푸시 알림을 서버에서 보내는 경우 토큰 등록 엔드포인트

마지막 항목은 미리 확인해두는 게 좋습니다. 서버에서 보내는 원격 푸시는 Expo Go에서
