export function hasAvatar(avatarUrl?: string | null): boolean {
  return Boolean(avatarUrl?.trim());
}

export function shouldOpenAvatarPrompt(options: {
  avatarUrl?: string | null;
  forcePrompt?: boolean;
}): boolean {
  if (hasAvatar(options.avatarUrl)) return false;
  return true;
}
