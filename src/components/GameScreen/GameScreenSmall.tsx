import GameBorder from '../../assets/GameBorder.svg';
import GameBackground from '../../assets/GameBackground.svg';
import YellowRuler from '../../assets/YellowRuler.svg';
import YodelyGuy from '../../assets/YodelyGuy.svg';
import { useEffect, useState } from 'react';

const points = {
  0: 162,
  1: 176,
  2: 190,
  3: 206,
  4: 220,
  5: 234,
  6: 250,
  7: 264,
  8: 280,
  9: 294,
  10: 308,
  11: 324,
  12: 338,
  13: 352,
  14: 368,
  15: 382,
  16: 398,
  17: 412,
  18: 428,
  19: 442,
  20: 456,
  21: 470,
  22: 486,
  23: 500,
  24: 516,
  25: 528,
};

const GameScreen = () => {
  const RIGHT_LIMIT = 531;
  const LEFT_LIMIT = 150;
  const START_POSITION_Y = 147;
  const MAX_MOVES = Object.keys(points).length - 1;

  const [positionX, setPositionX] = useState<number>(162);
  const [positionY, setPositionY] = useState<number>(START_POSITION_Y);
  const [remainingMoves, setRemainingMoves] = useState<number>(MAX_MOVES);

  const getClosestPointKey = (x: number) => {
    let closestKey = null;
    for (const [key, value] of Object.entries(points)) {
      if (value <= x) {
        closestKey = key;
      } else {
        break;
      }
    }
    return closestKey;
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'ArrowLeft' &&
        positionX < RIGHT_LIMIT &&
        positionX > LEFT_LIMIT
      ) {
        setPositionX((prevPositionX) =>
          Math.max(prevPositionX - 2, -window.innerWidth),
        );
        setPositionY((prevPositionY) => Math.max(prevPositionY - 0.935, 0));
      }

      if (event.key === 'ArrowRight') {
        setPositionX((prevPositionX) => {
          const newPositionX = Math.min(prevPositionX + 2, RIGHT_LIMIT);
          if (newPositionX === RIGHT_LIMIT) {
            setPositionY(START_POSITION_Y);
          }
          return newPositionX;
        });
        setPositionY((prevPositionY) =>
          positionX < RIGHT_LIMIT
            ? Math.min(prevPositionY + 0.935, window.innerHeight - 280)
            : START_POSITION_Y,
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [positionX]);

  useEffect(() => {
    const closestKey = getClosestPointKey(positionX);
    if (closestKey !== null) {
      setRemainingMoves(MAX_MOVES - +closestKey);
    }
  }, [positionX]);

  return (
    <div className='relative m-auto w-screen h-screen max-w-[700px] min-[860px]:scale-[1.2] min-[860px]:bottom-[10vh] min-[990px]:scale-[1.4] min-[990px]:bottom-[20vh] min-[1135px]:scale-[1.6] min-[1135px]:bottom-[30vh] min-[1600px]:scale-[1.8] min-[1600px]:bottom-[40vh] min-[1800px]:scale-[2] min-[1800px]:bottom-[50vh] min-[2000px]:scale-[2.2] min-[2000px]:bottom-[60vh] min-[2200px]:scale-[2.4] min-[2200px]:bottom-[70vh]'>
      <img
        src={GameBorder}
        alt='GameBorder'
        className='w-full absolute bottom-0 left-0 right-0 m-auto z-40'
      />
      <img
        src={GameBackground}
        alt='GameBackground'
        className='w-[85%] absolute bottom-0 left-0 right-0 m-auto z-20'
      />
      <img
        src={YellowRuler}
        alt='Ruler'
        className='w-[62%] h-[26px] absolute bottom-[217px] left-[142px] m-auto z-30 object-cover -rotate-[25deg]'
      />
      <img
        src={YodelyGuy}
        alt='YodelyGuy'
        className='w-[32px] absolute z-30'
        style={{
          left: `${positionX}px`,
          bottom: `${positionY}px`,
        }}
      />

      <div className='absolute bottom-[10px] left-[57px] w-[36px] h-[22px] bg-[#e3e3e3] text-[#333] text-[14px] font-bold rounded-[5px] z-40 flex items-center justify-center'>
        {remainingMoves}
      </div>
      <div className='absolute bottom-[10px] right-[57px] z-40 flex items-center justify-center'>
        <button className='w-fit h-[22px] px-1 bg-[#56639d] text-[#fff] text-[14px] font-bold rounded-[5px]  uppercase'>
          products
        </button>
      </div>
    </div>
  );
};

export default GameScreen;
