// src/components/Player.jsx
import React, { useState } from 'react';
import { Button } from 'antd';

const Player = ({ isRunning, startGame, pauseGame, killWord, currentPlayer }) => {
  const [score, setScore] = useState(0);

  const incrementScore = () => setScore(score + 1);
  const decrementScore = () => setScore(score - 1);

  return (
    <div className="player-container">
      <div className="button-container">
        <Button onClick={isRunning ? pauseGame : startGame} type="primary">
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={killWord} danger type="primary">Kill</Button>
      </div>
      <div className='score-container'>Score: {score}</div>
      <div className="button-container">
        <Button onClick={decrementScore}>-</Button>
        <Button onClick={incrementScore}>+</Button>
      </div>
    </div>
  );
};

export default Player;
