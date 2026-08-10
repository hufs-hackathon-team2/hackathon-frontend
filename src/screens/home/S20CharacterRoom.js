// CH 01 캐릭터 방 렌더링 + CH 03 배경 에셋 배치 (홈 탭 첫 화면)
import Placeholder from '../../components/common/Placeholder';

export default function S20CharacterRoom({ navigation }) {
  return (
    <Placeholder
      id="S20"
      title="캐릭터 방 (홈)"
      spec="CH 01 · CH 03"
      navigation={navigation}
      links={[
        { label: '기록 입력', to: 'LogNew' },
        { label: '이번 사이클 기록 목록', to: 'LogList' },
        { label: '위클리 카드', to: 'Weekly' },
        { label: '재개 화면 (테스트)', to: 'Resume' },
      ]}
    />
  );
}
