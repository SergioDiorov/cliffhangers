import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import OuterRocksSVG from '../../assets/OuterRocks.svg';
import OuterRocks from '../../assets/OuterRocks.png';
import OuterRocksCut from '../../assets/OuterRocksCut.png';
import Header from '../../assets/Header.png';
import GameBackground from '../../assets/GameBackground.svg';
import YellowRuler from '../../assets/YellowRuler.svg';
import YellowRulerRotate from '../../assets/YellowRulerRotate.svg';
import YodelyGuy from '../../assets/YodelyGuy.svg';
import GameBackgroundWide from '../../assets/GameBackgroundWide.svg';

import ScreamCrash from '../../assets/audio/ScreamCrash.mp3';
import SingleDing from '../../assets/audio/SingleDing.mp3';
import ThePriceIsRightYodelling from '../../assets/audio/ThePriceIsRightYodelling.mp3';
import WinningDingX10 from '../../assets/audio/WinningDingX10.mp3';

import { useGame } from '../../context/GameContext';
import {
  // points,
  // LEFT_LIMIT,
  MAX_MOVES,
  // RIGHT_LIMIT,
  // START_POSITION_Y,
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
  const [outerRocksSize, setOuterRocksSize] = useState<null | {
    width: number;
    height: number;
  }>(null);
  const [headerHeight, setHeaderHeight] = useState<null | number>(null);
  const [isGameStarted, setIsGmeStarted] = useState<boolean>(false);
  const [rightLimit, setRightLimit] = useState<number>(0);
  const [leftLimit, setLeftLimit] = useState<number>(0);
  const [startPositionY, setStartPositionY] = useState<number>(0);
  const [points, setPoints] = useState<{ [key: number]: number }>({});
  const [isRendered, setIsRendered] = useState<boolean>(false);

  const yodelAudioRef = useRef<any>(null);
  const climberStopsMovingAudioRef = useRef<any>(null);
  const winningAudioRef = useRef<any>(null);
  const fallAudioRef = useRef<any>(null);
  const outerRocksRef = useRef<any>(null);
  const headerRef = useRef<any>(null);
  const GameBackgroundRef = useRef<any>(null);
  const YodelyGuyRef = useRef<any>(null);
  const RulerRef = useRef<any>(null);

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
        positionX < rightLimit &&
        positionX > leftLimit
      ) {
        setIsYodeling(true);
        setIsGmeStarted(true);
        setPositionX((prevPositionX) =>
          Math.max(prevPositionX - 2, -window.innerWidth),
        );
        setPositionY((prevPositionY) => Math.max(prevPositionY - 0.935, 0));
      }

      if (event.key === 'ArrowRight') {
        positionX < rightLimit && setIsYodeling(true);
        setIsGmeStarted(true);

        setPositionX((prevPositionX) => {
          const newPositionX = Math.min(prevPositionX + 2, rightLimit);
          if (newPositionX === rightLimit) {
            positionY !== startPositionY && setFalling(true);
            positionY !== startPositionY && handlePlayFallAudioRef();
            setPositionY(startPositionY);
          }
          return newPositionX;
        });
        setPositionY((prevPositionY) =>
          positionX < rightLimit
            ? Math.min(prevPositionY + 0.94, window.innerHeight)
            : startPositionY,
        );
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        setIsYodeling(false);
        positionX < rightLimit && handlePlayClimberStopsAudioRef();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [positionX, positionY, isRendered]);

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
    const timer = setTimeout(() => {
      setIsRendered(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isYodeling) {
      handlePlayYodelAudioRef();
    }
  }, [isYodeling]);

  useEffect(() => {
    if (outerRocksRef) {
      setOuterRocksSize({
        width: outerRocksRef.current.width,
        height: outerRocksRef.current.height,
      });
    }
  }, [outerRocksRef.current]);

  useEffect(() => {
    if (headerRef) {
      setHeaderHeight(headerRef.current.height);
    }
  }, [headerRef.current, isRendered]);

  useEffect(() => {
    if (YodelyGuyRef.current && GameBackgroundRef.current) {
      const yodelyGuyRect = YodelyGuyRef.current.getBoundingClientRect();
      const gameBackgroundRect =
        GameBackgroundRef.current.getBoundingClientRect();

      const relativeX = yodelyGuyRect.left - gameBackgroundRect.left;
      const relativeY = gameBackgroundRect.bottom - yodelyGuyRect.bottom;

      setPositionX(relativeX);
      setPositionY(relativeY);
      setStartPositionY(relativeY);
    }
  }, [YodelyGuyRef.current, GameBackgroundRef.current, isRendered]);

  useEffect(() => {
    if (RulerRef.current && GameBackgroundRef.current && YodelyGuyRef.current) {
      const rulerRect = RulerRef.current.getBoundingClientRect();
      const gameBackgroundRect =
        GameBackgroundRef.current.getBoundingClientRect();
      const yodelyGuyRect = YodelyGuyRef.current.getBoundingClientRect();

      const rulerRight = rulerRect.right;
      const gameBackgroundLeft = gameBackgroundRect.left;

      const distanceFromLeft = rulerRight - gameBackgroundLeft;

      const yodelyGuyWidth = yodelyGuyRect.width / 1.3;
      const adjustedDistance = distanceFromLeft - yodelyGuyWidth;

      setRightLimit(adjustedDistance);

      const rulerLeft = rulerRect.left;
      const distanceFromLeftLimit = rulerLeft - gameBackgroundLeft - 10;

      setLeftLimit(distanceFromLeftLimit);

      // Calculate points
      const numberOfPoints = 25;
      const pointDistance =
        (adjustedDistance - distanceFromLeftLimit) / numberOfPoints;
      const pointsObject: { [key: number]: number } = {};

      for (let i = 0; i <= numberOfPoints; i++) {
        pointsObject[i] = distanceFromLeftLimit + i * pointDistance;
      }
      console.log(pointsObject);

      setPoints({ ...pointsObject, 25: pointsObject[25] - 5 });
    }
  }, [
    RulerRef.current,
    GameBackgroundRef.current,
    YodelyGuyRef.current,
    isRendered,
  ]);

  return (
    <div className='relative m-auto w-screen h-screen transition-opacity duration-500 animate-fadeIn'>
      <audio
        ref={yodelAudioRef}
        src={ThePriceIsRightYodelling}
        preload='auto'
      />
      <audio ref={climberStopsMovingAudioRef} src={SingleDing} preload='auto' />
      <audio ref={winningAudioRef} src={WinningDingX10} preload='auto' />
      <audio ref={fallAudioRef} src={ScreamCrash} preload='auto' />

      <img
        src={OuterRocksCut}
        alt='OuterRocks'
        className='w-full absolute bottom-0 left-0 right-0 m-auto z-40 max-w-screen max-h-[101vh]'
        ref={outerRocksRef}
      />
      <img
        src={Header}
        style={
          outerRocksSize && headerHeight
            ? {
                maxWidth:
                  outerRocksSize.width > 1230
                    ? 1230
                    : outerRocksSize.width - 70,
                bottom: outerRocksSize.height - headerHeight + 7,
              }
            : {}
        }
        alt='Header'
        className='w-full h-auto absolute left-0 right-[20px] m-auto z-50 bottom-[365px] max-w-[1400px]'
        ref={headerRef}
      />
      <img
        src={
          outerRocksSize && outerRocksSize.width > 1230
            ? GameBackgroundWide
            : GameBackground
        }
        alt='GameBackground'
        ref={GameBackgroundRef}
        className='w-[85%] absolute bottom-0 left-0 right-0 m-auto z-20'
      />
      <div
        className='absolute bottom-0 left-0 right-0 m-auto w-full h-full'
        style={{
          maxWidth: !!GameBackgroundRef?.current?.offsetWidth
            ? GameBackgroundRef.current.offsetWidth
            : 'auto',
          maxHeight: !!GameBackgroundRef?.current?.offsetHeight
            ? GameBackgroundRef.current.offsetHeight
            : 'auto',
        }}
      >
        {/* <img
          src={YellowRuler}
          alt='Ruler'
          className='w-[72%] h-full absolute bottom-[16%] left-[16%] m-auto z-30 object-cover -rotate-[25deg]'
        /> */}
        <img
          src={YellowRulerRotate}
          ref={RulerRef}
          alt='Ruler'
          className={`h-full absolute ${
            outerRocksSize && outerRocksSize.width > 1230
              ? ' w-[45%] bottom-[19.2%] left-[28%]'
              : ' w-[65%] bottom-[18.5%] left-[20%]'
          } m-auto z-30 object-contain`}
        />
        <img
          src={YodelyGuy}
          alt='YodelyGuy'
          ref={YodelyGuyRef}
          className={`absolute z-30 yodely-guy ${falling ? 'fall' : ''}
          ${
            outerRocksSize && outerRocksSize.width > 1230
              ? ' w-[3%] bottom-[46.2%] left-[28%]'
              : ' w-[5%] bottom-[43.5%] left-[19.7%]'
          }`}
          style={
            isGameStarted && positionX !== 0 && positionY !== 0
              ? {
                  left: `${positionX}px`,
                  bottom: `${positionY}px`,
                }
              : {}
          }
        />
      </div>

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
