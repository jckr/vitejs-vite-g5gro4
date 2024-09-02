import { useCallback, useEffect, useRef, useState } from 'react';
export const DimensionsObserver = (props: {
  children: ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => React.ReactNode;
}) => {
  const { children } = props;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;

      if (
        dimensions.width !== offsetWidth &&
        dimensions.height !== offsetHeight
      ) {
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      updateDimensions();
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
      }}
    >
      {children(dimensions)}
    </div>
  );
};
