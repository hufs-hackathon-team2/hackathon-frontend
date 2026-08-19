// CH 01 캐릭터 방 · CH 04 캐릭터 아카이브
import api, { USE_MOCK } from './client';
import { MOCK_ROOM, MOCK_ARCHIVE } from './mock/characters';
import { getDateFormat } from '../date';

// 목데이터일 때 쓰는 가짜 저장소. 앱을 새로고침하면 처음 상태로 돌아간다.
let mockRoom = MOCK_ROOM;
let mockArchive = MOCK_ARCHIVE;

// 서버는 char_type 을 "CAT" / "DOG" 로 준다. 화면은 소문자 character_type 을 쓴다.
function withType(data) {
  return {
    ...data,
    character_type: data.character_type ?? data.char_type?.toLowerCase() ?? 'cat',
  };
}

export async function getRoom() {
  if (USE_MOCK) return withType(mockRoom);

  const res = await api.get('/characters/me/room/');
  return withType(res.data);
}

// 목데이터에서 캐릭터를 새로 고르면 방에도 반영한다.
// 실제 서버는 PATCH /users/me/character 가 처리하므로 목에서만 쓴다.
export function setMockCharacter(type, name) {
  mockRoom = { ...mockRoom, character_type: type, character_name: name };
}

// 다 키워서 보관한 캐릭터 목록
export async function getArchive() {
  if (USE_MOCK) return mockArchive.map(withType);

  const res = await api.get('/characters/archive/');
  return (res.data.characters ?? []).map(withType);
}

// 완성한 캐릭터를 앨범에 보관하고, 새 캐릭터를 고를 수 있는 상태로 만든다
export async function archiveCharacter() {
  if (USE_MOCK) {
    const archived = {
      character_id: `CHR${Date.now()}`,
      char_type: (mockRoom.character_type ?? 'cat').toUpperCase(),
      character_name: mockRoom.character_name,
      completed_at: mockRoom.completed_at ?? getDateFormat(new Date()),
    };

    mockArchive = [archived].concat(mockArchive);

    // 보관했으니 방은 1단계부터 다시 시작한다
    mockRoom = {
      ...mockRoom,
      total_score: 0,
      current_stage: '1-small',
      gauge: { current: 0, max: 5 },
      assets: [],
      is_completed: false,
      started_at: getDateFormat(new Date()),
      completed_at: null,
    };

    return { archived_id: archived.character_id };
  }

  const res = await api.post('/characters/me/archive/');
  return res.data;
}
