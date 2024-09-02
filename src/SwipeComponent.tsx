import { useRef, useEffect, useCallback } from 'react';

type SwipeProps = {
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
};

const SwipeComponent = (props: React.PropsWithChildren<SwipeProps>) => {
  const { onLeft, onRight, onUp, onDown, children } = props;
  const startX = useRef(0);
  const startY = useRef(0);

  // Handle start event
  const handleStart = useCallback(({ x, y }: { x: number; y: number }) => {
    startX.current = x;
    startY.current = y;
  }, []);

  // Handle end event
  const handleEnd = useCallback(({ x, y }: { x: number; y: number }) => {
    const diffX = x - startX.current;
    const diffY = y - startY.current;
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 30) {
        return onRight?.();
      } else if (diffX < -30) {
        return onLeft?.();
      }
    } else {
      if (diffY > 30) {
        return onDown?.();
      } else if (diffY < -30) {
        return onUp?.();
      }
    }
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const x = e.touches[0].clientX;
      const y = e.touches[1].clientY;
      return handleStart({ x, y });
    },
    [handleStart]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const x = e.changedTouches[0].clientX;
      const y = e.changedTouches[1].clientY;
      return handleStart({ x, y });
    },
    [handleEnd]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleStart({ x: e.clientX, y: e.clientY });
    },
    [handleStart]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      handleEnd({ x: e.clientX, y: e.clientY });
    },
    [handleEnd]
  );

  useEffect(() => {
    document.body.addEventListener('touchend', handleTouchEnd);
    document.body.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.body.removeEventListener('touchend', handleTouchEnd);
      document.body.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      style={styles.container}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    userSelect: 'none',
  } as React.CSSProperties,
  text: {
    fontSize: '2rem',
    color: '#333',
    textAlign: 'center',
  } as React.CSSProperties,
};

export default SwipeComponent;
