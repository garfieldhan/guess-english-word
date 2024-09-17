import React, { useState } from 'react';
import { Button } from 'antd';

const Player = ({ isRunning, startGame, pauseGame, killWord, isActive, moveToNextPlayer }) => {
  const [score, setScore] = useState(0);

  const incrementScore = () => setScore(score + 1);
  const decrementScore = () => setScore(score - 1);

  const handlePauseGame = () => {
    pauseGame();
    moveToNextPlayer(); // 移动到下一个玩家
  };

  return (
    <div className="player-container">
      <div className="button-container">
        <Button onClick={isRunning ? handlePauseGame : startGame} type="primary" disabled={!isActive}>
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={killWord} danger type="primary" disabled={!isActive}>Kill</Button>
      </div>
      <div className='score-container'>Score: {score}</div>
      <div className="button-container">
        <Button onClick={decrementScore} disabled={!isActive}>-</Button>
        <Button onClick={incrementScore} disabled={!isActive}>+</Button>
      </div>
    </div>
  );
};

export default Player;