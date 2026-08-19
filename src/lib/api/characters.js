import api, { USE_MOCK } from './client';
import { MOCK_ROOM } from './mock/characters';

export async function getRoom() {
  if (USE_MOCK) return MOCK_ROOM;

  const res = await api.get('/characters/me/room/');

  // 서버는 char_type 을 "CAT" / "DOG" 로 준다. 화면은 소문자 character_type 을 쓴다.
  return {
    ...res.data,
    character_type: res.data.char_type?.toLowerCase() ?? 'cat',
  };
}
