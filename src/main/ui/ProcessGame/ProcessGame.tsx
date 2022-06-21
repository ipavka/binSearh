import React, {useEffect, useRef, useState} from 'react';
import CountUp from 'react-countup';
import {useGameSelector} from "../../bll/store";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import s from './ProcessGame.module.css'
import sApp from '../App.module.css'
import {Button} from "../common/copmponents/Button/Button";
import {InitialStateType, setLoadingAC} from "../../bll/redusers/game-reducer";

const calculateVariant = (min: number[], max: number[]) => {
  return Math.floor((min[min.length - 1] + max[max.length - 1]) / 2)
}

export const ProcessGame = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    numberTries,
    currentValue,
    isLoading,
  } = useGameSelector<InitialStateType>(state => state.game);

  const [countTries, setCountTries] = useState(1);
  const [variant, setVariant] = useState(0);
  const [initTries, setInitTries] = useState(numberTries);
  const [showResult, setShowResult] = useState(false);

  const setLoading = () => {
    dispatch(setLoadingAC(true));
    setTimeout(() => {
      dispatch(setLoadingAC(false));
    }, 1600);
  };

  useEffect(() => {
    setVariant(calculateVariant(variantMin.current, variantMax.current));
    setLoading();
  }, []);

  useEffect(() => {
    if (initTries < 0) navigate('/launch');
  }, [initTries]);

  useEffect(() => {
    setInitTries((value) => value - 1);
  }, [countTries]);

  const variantMin = useRef<number[]>([1]);
  const variantMax = useRef<number[]>([currentValue]);
  const statistics = useRef<{ id: number, number: number, answer: string }[]>([]);

  const buttonMax = () => {
    setLoading();
    setCountTries(countTries + 1);
    variantMin.current.push(variant)
    setVariant(calculateVariant(variantMin.current, variantMax.current));
    statistics.current.push({id: countTries, number: variant, answer: 'больше'});
  }
  const buttonMin = () => {
    setLoading();
    setCountTries(countTries + 1);
    variantMax.current.push(variant);
    setVariant(calculateVariant(variantMin.current, variantMax.current));
    statistics.current.push({id: countTries, number: variant, answer: 'меньше'});
  }
  const restart = () => {
    navigate('/launch');
  }

  const finish = (e: React.MouseEvent<HTMLButtonElement>) => {
    statistics.current.push({id: countTries, number: variant, answer: 'угадал!'});
    setShowResult(true);
  }

  return (
    <div>
      <div className={sApp.mainBlock}>
        <div className={s.main}>
          <h2>Мой вариант</h2>
          <h1><CountUp delay={0}
                       duration={1.5}
                       start={variantMin.current[variantMin.current.length - 1]}
                       end={variant}
                       className={s.countUp}/>
          </h1>
        </div>
        <div className={s.buttonChoice}>
          <Button disabled={isLoading} onClick={buttonMax}>Больше?</Button>
          <Button disabled={isLoading} onClick={buttonMin}>Меньше?</Button>
          <Button disabled={isLoading} onClick={finish}>Угадал!</Button>
        </div>
        <div>
          <h2>Осталось: {initTries} из {numberTries} попыток </h2>
          <h2>Заданный максимум: {currentValue}</h2>
        </div>
        <Button disabled={isLoading} onClick={restart}>Начать заново</Button>
        {showResult && <div>{statistics.current.map(el => {
          return (
            <div key={`${el.id}-${el.number}`}>
              <span>моё число: {el.number} </span><span>твой ответ: {el.answer}</span>
            </div>
          )
        })}</div>}
      </div>

      <div>
        <h2>Твое число: 123</h2>
        <h2>Твое число: количество попыток: 8 из 11</h2>
        <h2>Статистика</h2>
        {showResult && <div>{statistics.current.map(el => {
          return (
            <div key={`${el.id}-${el.number}`}>
              <span>моё число: {el.number} </span><span>твой ответ: {el.answer}</span>
            </div>
          )
        })}</div>}
      </div>
    </div>
  );
};

