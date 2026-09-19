function displayName(person) {
  return person?.username || person?.phone_number || "Unknown";
}

export function conversationTitle(conversation, currentUserId) {
  if (!conversation) return "";
  if (conversation.is_group) {
    return conversation.participants.map(displayName).join(", ") || "Group chat";
  }
  const other = conversation.participants.find((p) => p.id !== currentUserId);
  return displayName(other || conversation.participants[0]);
}

export function conversationIsOnline(conversation, currentUserId) {
  if (!conversation) return false;
  if (conversation.is_group) {
    return conversation.participants.some((p) => p.id !== currentUserId && p.is_online);
  }
  const other = conversation.participants.find((p) => p.id !== currentUserId);
  return Boolean(other?.is_online);
}

export function formatTimestamp(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
