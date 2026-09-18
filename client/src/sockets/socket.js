// Native WebSocket client (not Socket.IO).
// The FastAPI backend exposes a plain `/ws` WebSocket endpoint, so we speak
// the native browser WebSocket protocol directly instead of pulling in the
// Socket.IO client/server stack.

const WS_BASE_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8000";

export function createChatSocket(token, handlers = {}) {
  const socket = new WebSocket(`${WS_BASE_URL}/ws?token=${encodeURIComponent(token)}`);

  socket.onopen = (event) => handlers.onOpen?.(event);
  socket.onclose = (event) => handlers.onClose?.(event);
  socket.onerror = (event) => handlers.onError?.(event);
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handlers.onMessage?.(data);
    } catch (err) {
      console.error("Failed to parse WebSocket message", err);
    }
  };

  return {
    send(payload) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
      }
    },
    close() {
      socket.close();
    },
  };
}
