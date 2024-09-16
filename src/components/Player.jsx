// src/components/Player.jsx
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

const Player = ({ gameData, setDisplayedWordData }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const toggleStartPause = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
    } else {
      const id = setInterval(() => {
        // Select a random word from the gameData
        const randomWord = gameData[Math.floor(Math.random() * gameData.length)];
        setDisplayedWordData({
          headWord: randomWord.headWord,
          tranCn: randomWord.content.word.content.trans[0].tranCn
        });
      }, 5); // Adjust interval as needed (500ms in this case)
      setIntervalId(id);
      setIsRunning(true);
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, [intervalId]);

  return (
    <div>
      <Button onClick={toggleStartPause}>
        {isRunning ? 'Pause' : 'Start'}
      </Button>
    </div>
  );
};

export default Player;
