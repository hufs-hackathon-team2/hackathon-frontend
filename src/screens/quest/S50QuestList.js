// QS 01 AI 퀘스트 제안 (WK 01 에서 미리 생성해둔 5개, 실시간 AI 호출 없음)
import Placeholder from '../../components/common/Placeholder';

export default function S50QuestList({ navigation }) {
  return (
    <Placeholder
      id="S50"
      title="퀘스트 리스트"
      spec="QS 01"
      navigation={navigation}
      links={[
        { label: '직접 만들기', to: 'QuestCreate' },
        { label: '진행 상황', to: 'QuestProgress' },
      ]}
    />
  );
}
