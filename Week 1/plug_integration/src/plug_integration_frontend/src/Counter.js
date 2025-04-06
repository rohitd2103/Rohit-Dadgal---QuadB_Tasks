import React, { useEffect, useState } from 'react';
import { canisterActor } from './agent';

const Counter = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const fetchCounter = async () => {
      const result = await canisterActor.getCounter();
      setCounter(result);
    };
    fetchCounter();
  }, []);

  const incrementCounter = async () => {
    const newCounter = await canisterActor.increment();
    setCounter(newCounter);
  };

  return (
    <div>
      <div>Counter Value: {counter}</div>
      <button onClick={incrementCounter}>Increment</button>
    </div>
  );
};

export default Counter;