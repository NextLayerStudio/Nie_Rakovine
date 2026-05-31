import type { CSSProperties } from "react";

export function forumAvatarStyle(forum: {
  imageUrl?: string | null;
  accentColor?: string | null;
}): CSSProperties {
  if (forum.imageUrl?.trim()) {
    return {
      backgroundImage: `url(${forum.imageUrl.trim()})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: forum.accentColor ?? "#6F2380" };
}

export function profileAvatarStyle(avatarUrl?: string | null): CSSProperties {
  if (avatarUrl?.trim()) {
    return {
      backgroundImage: `url(${avatarUrl.trim()})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return {
    background: "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)",
  };
}
