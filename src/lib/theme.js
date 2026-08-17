// 디자인 값 모음. 색·크기를 바꿀 일이 있으면 여기만 고친다.

export const COLORS = {
  // 배경
  bg: '#E3ECFF',

  //카드
  card: '#E1ECE7',//연초록
  cardAlt: '#F5F5F5',
  cardWhite: '#FFFFFF',
  cardGray: '#ECEFF5',

  // 글자
  text: '#1B1A18',
  textSub: '#504D49',
  border: '#D5DDE8',

  // 주 버튼
  primary: '#428A67',
  primaryText: '#FFFFFF',

  // 이동 버튼 (다른 화면으로)
  navigate: '#3E629F',
  navigateText: '#FFFFFF',

  // 비활성 선택버튼
  disabled: '#CFCCC9',
  disabledText: '#504D49',

  // 삭제
  danger: '#F6D8D5',
  dangerText: '#2A0C09',
};

export const FONT = {
  regular: 'AstaSans',
  semibold: 'AstaSansSemiBold',
  bold: 'AstaSansBold',

  title: 22,
  cardTitle: 18,
  body: 16,
  caption: 13,
};

export const WEIGHT = {
  bold: '700',
  regular: '400',
};

export const SPACE = {
  screen: 20,   // 화면 좌우 여백
  card: 16,     // 카드 안쪽 여백
  gap: 12,      // 요소 사이 간격
};

export const RADIUS = {
  card: 20,
  button: 8,
  input: 8,
};
