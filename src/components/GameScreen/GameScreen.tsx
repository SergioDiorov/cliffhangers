import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import GameBorder from '../../assets/GameBorder.svg';
import GameBackground from '../../assets/GameBackground.svg';
import YellowRuler from '../../assets/YellowRuler.svg';
import YodelyGuy from '../../assets/YodelyGuy.svg';

import ScreamCrash from '../../assets/audio/ScreamCrash.mp3';
import SingleDing from '../../assets/audio/SingleDing.mp3';
import ThePriceIsRightYodelling from '../../assets/audio/ThePriceIsRightYodelling.mp3';
import WinningDingX10 from '../../assets/audio/WinningDingX10.mp3';

import { useGame } from '../../context/GameContext';
import {
  points,
  LEFT_LIMIT,
  MAX_MOVES,
  RIGHT_LIMIT,
  START_POSITION_Y,
} from './constants';

import './GameScreen.css';

const GameScreen = () => {
  const {
    remainingMoves,
    setRemainingMoves,
    positionX,
    setPositionX,
    positionY,
    setPositionY,
  } = useGame();

  const [falling, setFalling] = useState<boolean>(false);
  const [isYodeling, setIsYodeling] = useState<boolean>(false);

  const yodelAudioRef = useRef<any>(null);
  const climberStopsMovingAudioRef = useRef<any>(null);
  const winningAudioRef = useRef<any>(null);
  const fallAudioRef = useRef<any>(null);

  const navigate = useNavigate();

  const handlePlayYodelAudioRef = () => {
    climberStopsMovingAudioRef.current.pause();
    winningAudioRef.current.pause();
    fallAudioRef.current.pause();
    yodelAudioRef.current.pause();
    yodelAudioRef.current.currentTime = 0;
    yodelAudioRef.current.play();
  };

  const handlePlayClimberStopsAudioRef = () => {
    yodelAudioRef.current.pause();
    winningAudioRef.current.pause();
    fallAudioRef.current.pause();
    climberStopsMovingAudioRef.current.pause();
    climberStopsMovingAudioRef.current.currentTime = 0;
    climberStopsMovingAudioRef.current.play();
  };

  const handlePlayWinningAudioRef = () => {
    yodelAudioRef.current.pause();
    climberStopsMovingAudioRef.current.pause();
    fallAudioRef.current.pause();
    winningAudioRef.current.pause();
    winningAudioRef.current.currentTime = 0;
    winningAudioRef.current.play();
  };

  const handlePlayFallAudioRef = () => {
    yodelAudioRef.current.pause();
    climberStopsMovingAudioRef.current.pause();
    winningAudioRef.current.pause();
    fallAudioRef.current.pause();
    fallAudioRef.current.currentTime = 0;
    fallAudioRef.current.play();
  };

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
      if (event.key === ' ') {
        handlePlayWinningAudioRef();
      }

      if (
        event.key === 'ArrowLeft' &&
        positionX < RIGHT_LIMIT &&
        positionX > LEFT_LIMIT
      ) {
        setIsYodeling(true);
        setPositionX((prevPositionX) =>
          Math.max(prevPositionX - 2, -window.innerWidth),
        );
        setPositionY((prevPositionY) => Math.max(prevPositionY - 0.935, 0));
      }

      if (event.key === 'ArrowRight') {
        positionX < RIGHT_LIMIT && setIsYodeling(true);
        setPositionX((prevPositionX) => {
          const newPositionX = Math.min(prevPositionX + 2, RIGHT_LIMIT);
          if (newPositionX === RIGHT_LIMIT) {
            positionY !== START_POSITION_Y && setFalling(true);
            positionY !== START_POSITION_Y && handlePlayFallAudioRef();
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

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        setIsYodeling(false);
        positionX < RIGHT_LIMIT && handlePlayClimberStopsAudioRef();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [positionX, positionY]);

  useEffect(() => {
    const closestKey = getClosestPointKey(positionX);
    if (closestKey !== null) {
      setRemainingMoves(MAX_MOVES - +closestKey);
    }
  }, [positionX]);

  useEffect(() => {
    if (falling) {
      const timer = setTimeout(() => {
        setFalling(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [falling]);

  useEffect(() => {
    if (isYodeling) {
      handlePlayYodelAudioRef();
    }
  }, [isYodeling]);

  return (
    <div className='relative m-auto w-screen h-screen max-w-[700px] min-[860px]:scale-[1.2] min-[860px]:bottom-[10vh] min-[990px]:scale-[1.4] min-[990px]:bottom-[20vh] min-[1135px]:scale-[1.6] min-[1135px]:bottom-[30vh] min-[1600px]:scale-[1.8] min-[1600px]:bottom-[40vh] min-[1800px]:scale-[2] min-[1800px]:bottom-[50vh] min-[2000px]:scale-[2.2] min-[2000px]:bottom-[60vh] min-[2200px]:scale-[2.4] min-[2200px]:bottom-[70vh] transition-opacity duration-500 animate-fadeIn'>
      <audio
        ref={yodelAudioRef}
        src={ThePriceIsRightYodelling}
        preload='auto'
      />
      <audio ref={climberStopsMovingAudioRef} src={SingleDing} preload='auto' />
      <audio ref={winningAudioRef} src={WinningDingX10} preload='auto' />
      <audio ref={fallAudioRef} src={ScreamCrash} preload='auto' />

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
        className={`w-[32px] absolute z-30 yodely-guy ${falling ? 'fall' : ''}`}
        style={{
          left: `${positionX}px`,
          bottom: `${positionY}px`,
        }}
      />

      <div className='absolute bottom-[10px] left-[57px] w-[36px] h-[22px] bg-[#e3e3e3] text-[#333] text-[14px] font-bold rounded-[5px] z-40 flex items-center justify-center'>
        {remainingMoves}
      </div>
      <div className='absolute bottom-[10px] right-[57px] z-40 flex items-center justify-center'>
        <button
          className='w-fit h-[22px] px-1 bg-[#56639d] hover:bg-[#56639d]/70 active:bg-[#56639d]/50 text-[#fff] text-[14px] font-bold rounded-[5px] uppercase transition'
          onClick={() => navigate('/products')}
        >
          products
        </button>
      </div>
    </div>
  );
};

export default GameScreen;
