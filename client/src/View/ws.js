import { useEffect } from 'react';

export function useWs(dispatch) {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3333/ws');
    let closed = false;
    ws.onmessage = (event) => {
      if (closed) return;
      const message = JSON.parse(event.data);
      dispatch(message);
    };
    return () => {
      closed = true;
      ws.close();
    };
  }, [dispatch]);
}
