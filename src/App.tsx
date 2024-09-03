import './App.css';
import { Dice } from './Dice';
import { DimensionsObserver } from './DimensionsObserver';
import { Form } from './Form';
import SwipeComponent from './SwipeComponent';
import { useReducer, useState } from 'react';
import { handleAction, initialStats } from './reducer';


function App() {
  const [stats, dispatch] = useReducer(handleAction, initialStats);
  const [running, setRunning] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ height: '50%' }}>
          <Form stats={stats} dispatch={dispatch} />
      </div>
      <div style={{ height: '50%', maxHeight: '70%', overflow: 'hidden', margin: '20px' }}>
        <DimensionsObserver>
          {({ width, height }) => (
            <Dice
              minIs0={true}
              minStep={50}
              width={width}
              height={height}
              running={running}
              maxValue={10}
              onResult={(dice) => {
                if (running === true) {
                  if (stats.fightLocked === false) {
                    dispatch({type: 'fight_lock'});
                    dispatch({type: 'fight', payload: dice});
                  } 
                }
                setRunning(!running);
              }}
              random={Math.random}
            />
          )}
        </DimensionsObserver>
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
