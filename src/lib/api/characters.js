import api, { USE_MOCK } from './client';
import { MOCK_ROOM, MOCK_ARCHIVE } from './mock/characters';
import { getDateFormat } from '../date';

let mockRoom = MOCK_ROOM;
let mockArchive = MOCK_ARCHIVE;

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

export function setMockCharacter(type, name) {
  mockRoom = { ...mockRoom, character_type: type, character_name: name };
}

export async function getArchive() {
  if (USE_MOCK) return mockArchive.map(withType);

  const res = await api.get('/characters/archive/');
  return (res.data.characters ?? []).map(withType);
}

export async function archiveCharacter() {
  if (USE_MOCK) {
    const archived = {
      character_id: `CHR${Date.now()}`,
      char_type: (mockRoom.character_type ?? 'cat').toUpperCase(),
      character_name: mockRoom.character_name,
      completed_at: mockRoom.completed_at ?? getDateFormat(new Date()),
    };

    mockArchive = [archived].concat(mockArchive);

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
