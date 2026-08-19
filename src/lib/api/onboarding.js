import api, { USE_MOCK } from './client';

export async function saveInterest(interest) {
  if (USE_MOCK) return { interest };

  const res = await api.patch('/users/me/interest/', { interest });
  return res.data;
}

export async function saveCharacter(characterType, characterName) {
  if (USE_MOCK) return { character_type: characterType, character_name: characterName };

  const res = await api.patch('/users/me/character/', {
    character_type: characterType,
    character_name: characterName,
  });
  return res.data;
}

export async function completeOnboarding() {
  if (USE_MOCK) return { onboarding_completed: true };

  const res = await api.post('/users/me/onboarding-complete/', {
    onboarding_completed: true,
  });
  return res.data;
}
