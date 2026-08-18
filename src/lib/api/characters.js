import api, { USE_MOCK } from './client';
import { MOCK_ROOM } from './mock/characters';

export async function getRoom() {
  if (USE_MOCK) return MOCK_ROOM;

  const res = await api.get('/characters/me/room');
  return res.data;
}
