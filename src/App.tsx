import './App.css';
import { Dice } from './Dice';
import { DimensionsObserver } from './DimensionsObserver';
import SwipeComponent from './SwipeComponent';
import { useState } from 'react';

function App() {
  const [running, setRunning] = useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ height: '10%' }}>
        <Swiper />
      </div>
      <div style={{ height: '100%' }}>
        <DimensionsObserver>
          {({ width, height }) => (
            <Dice
              minIs0={true}
              minStep={50}
              width={width}
              height={height}
              running={running}
              maxValue={10}
              onResult={() => setRunning(!running)}
            />
          )}
        </DimensionsObserver>
      </div>
      <div style={{ height: '10%' }}>
        <Swiper />
      </div>
    </div>
  );
}

function Swiper() {
  const [swipe, setSwipe] = useState<'up' | 'down' | 'left' | 'right' | null>(
    null
  );
  const swipeProps = {
    onLeft: () => setSwipe('left'),
    onRight: () => setSwipe('right'),
    onUp: () => setSwipe('up'),
    onDown: () => setSwipe('down'),
  };
  return (
    <SwipeComponent {...swipeProps}>
      <div>{swipe || 'swipe'}</div>
    </SwipeComponent>
  );
}
export default App;
