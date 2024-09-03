import './Dice.css';
import { useCallback, useEffect, useRef, useState } from 'react';
const DIE_HEIGHT = 40;
const DIE_WIDTH = 40;

type DieProps = {
  minIs0: boolean,
  running: boolean;
  onResult: (result: number) => void;
  maxValue: number;
  random: () => number;
  minStep: number;
};

type DiceProps = DieProps & {
  width: number;
  height: number;
  minIs0?: boolean;
  random?: () => number;
  minStep?: number;
};

export const Dice = (props: DiceProps) => {
  const nbRows = Math.floor(props.height / DIE_HEIGHT);
  const nbCols = Math.floor(props.width / DIE_WIDTH);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {new Array(nbRows).fill(0).map((_, r) => (
        <div style={{display: 'flex', flexDirection: 'column'}}
        key={`row_${r}`}>

        {new Array(nbCols).fill(0).map((_, c) => (
        <Die
          key={`die-${r}-${c}`}
          minIs0={props.minIs0 ?? false}
          running={props.running}
          onResult={props.onResult}
          maxValue={props.maxValue}
          minStep={props.minStep ?? 0}
          random={props.random ?? Math.random}
        />))}
        </div>
      ))}
    </div>
  );
};

export const Die = (props: DieProps) => {
  const { onResult, minIs0, minStep, running, random, maxValue } = props;
  const requestRef = useRef<number | null>(null);
  const timeRef = useRef<number | null>(null);
  const lastUpdatedRef = useRef<number | null>(0);
  const [value, setValue] = useState(0);
  const tick = (time: number) => {
    if (
      lastUpdatedRef === null ||
      time - (lastUpdatedRef.current ?? 0) > minStep
    ) {
      const rawValue = random() * maxValue;
      const ajustedValue = minIs0 ? Math.floor(rawValue) : Math.ceil(value); 
      setValue(ajustedValue);
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
      onMouseUp={() => onResult(value)}
    >
      {value}
    </div>
  );
};
