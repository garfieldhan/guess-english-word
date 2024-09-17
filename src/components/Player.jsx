import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { CheckOutlined, CloseOutlined, DashboardTwoTone } from '@ant-design/icons';

const Player = ({ isRunning, startGame, pauseGame, killWord, isActive, moveToNextPlayer }) => {
  const [score, setScore] = useState(0);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [time, setTime] = useState(0); // 时间以秒为单位
  const timerRef = useRef(null); // 引用计时器的 ID

  // 格式化时间为 00:00
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 启动和停止计时器
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    // 清理计时器
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const incrementScore = () => {
    setScore(score + 1);
    setButtonsDisabled(true);
    killWord();
    clearInterval(timerRef.current); // 停止计时
  };

  const decrementScore = () => {
    setScore(score - 1);
    setButtonsDisabled(true);
    clearInterval(timerRef.current); // 停止计时
  };

  const handlePauseGame = () => {
    pauseGame();
    moveToNextPlayer(); // 移动到下一个玩家
    setButtonsDisabled(false);
  };

  return (
    <div className="player-container">
      <div className="button-container">
        <Button onClick={isRunning ? handlePauseGame : startGame} type="primary" disabled={!isActive}>
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        {/* <Button onClick={killWord} danger type="primary" disabled={!isActive}>Kill</Button> */}
      </div>
      <div className='score-container'>
        Score: {score} &nbsp;<DashboardTwoTone />: {formatTime(time)}
      </div>
      <div className="button-container">
        <Button onClick={decrementScore} disabled={!isActive || buttonsDisabled} icon={<CloseOutlined />} danger type="primary"></Button>
        <Button onClick={incrementScore} disabled={!isActive || buttonsDisabled} icon={<CheckOutlined />} type="primary"></Button>
      </div>
    </div>
  );
};

export default Player;
