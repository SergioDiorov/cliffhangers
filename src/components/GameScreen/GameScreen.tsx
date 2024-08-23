import GameBorder from '../../assets/GameBorder.svg';
import GameBackground from '../../assets/GameBackground.svg';
import YellowRuler from '../../assets/YellowRuler.svg';
import YodelyGuy from '../../assets/YodelyGuy.svg';
import { useEffect, useState } from 'react';

const GameScreen = () => {
  const RIGHT_LIMIT = 1096;
  const LEFT_LIMIT = 311;
  const START_POSITION_Y = 305;

  const [positionX, setPositionX] = useState(336);
  const [positionY, setPositionY] = useState(START_POSITION_Y);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'ArrowLeft' &&
        positionX < RIGHT_LIMIT &&
        positionX > LEFT_LIMIT
      ) {
        setPositionX((prevPositionX) =>
          Math.max(prevPositionX - 5, -window.innerWidth),
        );
        setPositionY((prevPositionY) => Math.max(prevPositionY - 2.33, 0));
      }

      if (event.key === 'ArrowRight') {
        setPositionX((prevPositionX) => {
          const newPositionX = Math.min(prevPositionX + 5, RIGHT_LIMIT);
          if (newPositionX === RIGHT_LIMIT) {
            setPositionY(START_POSITION_Y);
          }
          return newPositionX;
        });
        setPositionY((prevPositionY) =>
          positionX < RIGHT_LIMIT
            ? Math.min(prevPositionY + 2.33, window.innerHeight - 305)
            : START_POSITION_Y,
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [positionX]);

  return (
    <div className='relative m-auto w-screen h-screen max-w-[1440px]'>
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
        className='w-[62%] h-[26px] absolute bottom-[462px] left-[294px] m-auto z-30 object-cover -rotate-[25deg]'
      />
      <img
        src={YodelyGuy}
        alt='YodelyGuy'
        className='w-[65px] absolute z-30'
        style={{
          left: `${positionX}px`,
          bottom: `${positionY}px`,
        }}
      />
    </div>
  );
};

export default GameScreen;
