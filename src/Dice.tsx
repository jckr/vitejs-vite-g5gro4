import './Dice.css';
import { useCallback, useEffect, useRef, useState } from 'react';
const DIE_HEIGHT = 40;
const DIE_WIDTH = 40;

type DieProps = {
  running: boolean;
  onResult: (result: number) => void;
  maxValue: number;
  random: () => number;
  minStep: number;
};

type DiceProps = DieProps & {
  width: number;
  height: number;
  random?: () => number;
  minStep?: number;
};

export const Dice = (props: DiceProps) => {
  const nbDice =
    Math.ceil(props.height / DIE_HEIGHT) * Math.ceil(props.width / DIE_WIDTH);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {new Array(nbDice).fill(0).map((_, index) => (
        <Die
          key={`die-${index}`}
          running={props.running}
          onResult={props.onResult}
          maxValue={props.maxValue}
          minStep={props.minStep ?? 0}
          random={props.random ?? Math.random}
        />
      ))}
    </div>
  );
};

export const Die = (props: DieProps) => {
  const { onResult, minStep, running, random, maxValue } = props;
  const requestRef = useRef<number | null>(null);
  const timeRef = useRef<number | null>(null);
  const lastUpdatedRef = useRef<number | null>(0);
  const [value, setValue] = useState(0);
  const tick = (time: number) => {
    if (
      lastUpdatedRef === null ||
      time - (lastUpdatedRef.current ?? 0) > minStep
    ) {
      setValue(Math.ceil(random() * maxValue));
      lastUpdatedRef.current = time;
    }
  };
  const animate = useCallback((time: number) => {
    if (timeRef.current !== null) {
      tick(time);
    }
    timeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (running) {
      requestRef.current = requestAnimationFrame(animate);
    } else if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
      timeRef.current = null;
    }

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [running]);

  return (
    <div
      className={`die die-${value}`}
      style={{ width: DIE_WIDTH, height: DIE_HEIGHT }}
      onClick={() => onResult(value)}
    >
      {value}
    </div>
  );
};
