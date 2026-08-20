import { useState, useEffect } from 'react';

// 그래서 일정 시간 넘게 걸릴 때만 표시한다.
export default function useDelayedBusy(busy, delay = 1000) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!busy) {
      setShow(false);
      return;
    }

    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [busy, delay]);

  return show;
}
