const KEY_PREFIX = "chat:lastRead:";

export function getLastRead(conversationId) {
  return localStorage.getItem(KEY_PREFIX + conversationId) || null;
}

export function markRead(conversationId, isoTimestamp) {
  localStorage.setItem(KEY_PREFIX + conversationId, isoTimestamp || new Date().toISOString());
}

export function unreadCount(conversation) {
  if (!conversation?.last_message) return 0;
  const lastRead = getLastRead(conversation.id);
  if (!lastRead) return conversation.last_message ? 1 : 0;
  return new Date(conversation.last_message.created_at) > new Date(lastRead) ? 1 : 0;
}
