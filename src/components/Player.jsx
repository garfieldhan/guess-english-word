// src/components/Player.jsx
import React, { useState } from 'react';
import { Button } from 'antd';

const Player = ({ isRunning, startGame, pauseGame, killWord }) => {
  const [score, setScore] = useState(0);

  const incrementScore = () => setScore(score + 1);
  const decrementScore = () => setScore(score - 1);

  return (
    <div className="player-container">
      <div className="button-container">
        <Button onClick={isRunning ? pauseGame : startGame}>
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={killWord}>Kill</Button>
      </div>
      <div>Score: {score}</div>
      <div className="button-container">
        <Button onClick={incrementScore}>+</Button>
        <Button onClick={decrementScore}>-</Button>
      </div>
    </div>
  );
};

export default Player;
