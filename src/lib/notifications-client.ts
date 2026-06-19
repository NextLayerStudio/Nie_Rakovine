export function notificationTypeLabel(type: string): string {
  switch (type) {
    case "NEW_POST": return "Nový príspevok";
    case "FORUM_THREAD_APPROVED": return "Fórum";
    case "FORUM_COMMENT_APPROVED": return "Fórum";
    case "NEW_EVENT_NEARBY": return "Aktivita v okolí";
    default: return "Oznámenie";
  }
}
