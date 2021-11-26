import { useEffect } from 'react';

export function useWs(dispatch) {
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1));
    const ws = new WebSocket(
      `ws://localhost:3333/ws?windowId=${params.get('windowId')}`,
    );
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
