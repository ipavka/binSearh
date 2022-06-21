import React, {useEffect, useRef, useState} from 'react';

type DebouncePropsType = {
  props: any
}
export const Debounce: React.FC<DebouncePropsType> = ({props}) => {

  useEffect(() => {
    debouncedLogging(props)
  }, [props])

  const [info, setInfo] = useState<string>('');

  const Debounced = (func: Function, delay: number) => {
    const ref = useRef(0);
    return (...args: any) => {
      clearTimeout(ref.current);
      ref.current = Number(setTimeout(() => func(...args), delay));
    };
  };

  const debouncedLogging = Debounced(setInfo, 1000);

  return (
    <div>
      <h4>Угадаю максимум за: {info} попыток</h4>
    </div>
  );
};
