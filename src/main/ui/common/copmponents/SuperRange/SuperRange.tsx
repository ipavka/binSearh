import React, {ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, useCallback, useEffect, useRef} from 'react'
import s from './SuperRange.module.css'

// тип пропсов обычного инпута
type DefaultInputPropsType = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

// здесь мы говорим что у нашего инпута будут такие же пропсы как у обычного инпута
// (чтоб не писать value: string, onChange: ...; они уже все описаны в DefaultInputPropsType)
type SuperRangePropsType = DefaultInputPropsType & { // и + ещё пропсы которых нет в стандартном инпуте
  value: number
  min: number
  max: number
  onChangeRange?: (value: number) => void
  completeChanges?: () => void
};

export const SuperRange: React.FC<SuperRangePropsType> = (
  {
    type, // достаём и игнорируем чтоб нельзя было задать другой тип инпута
    onChange, onChangeRange,
    className,
    value,
    min,
    max,
    step,
    completeChanges,
    ...restProps// все остальные пропсы попадут в объект restProps
  }
) => {
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<any>(null);


  // Преобразовать в проценты
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Диапазон для уменьшения с левой стороны
  useEffect(() => {
    const minPercent = getPercent(value);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [value, getPercent]);


  const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e) // сохраняем старую функциональность
    const value = Math.min(Number(e.currentTarget.value), max);
    onChangeRange && onChangeRange(value)
    minValRef.current = value;
  }
  const onMouseUpHandler = () => {
    completeChanges && completeChanges();
    console.log('museUpHandler')
  }

  const finalRangeClassName = `${s.range} ${s.rangeLeft} ${className ? className : ''}`

  return (
    <div className={s.container}>
      <input
        type="range"
        step={step ? step : 1}
        min={min}
        max={max}
        value={value}
        onMouseUp={onMouseUpHandler}
        onChange={onChangeCallback}
        className={finalRangeClassName}
        style={{zIndex: value > max - 100 ? "5" : undefined}}
      />
      <div className={s.slider}>
        <div className={s.sliderTrack}/>
        <div ref={range} className={s.sliderRange}/>
        <div className={s.sliderLeftValue}>{value}</div>
      </div>
    </div>
  )
}

