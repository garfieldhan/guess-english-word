// src/components/Player.jsx
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

const Player = ({ gameData, setDisplayedWordData, autoPlay }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentWordData, setCurrentWordData] = useState({ headWord: '', tranCn: '' });

  const playAudio = (word) => {
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${word}&type=1`;
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const playAudioTwice = (word) => {
    playAudio(word);
    setTimeout(() => playAudio(word), 1000); // Play the audio again after 1 second
  };

  const toggleStartPause = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
      // Auto play sound when paused
      if (autoPlay && currentWordData.headWord) {
        playAudioTwice(currentWordData.headWord);
      }
    } else {
      const id = setInterval(() => {
        // Select a random word from the gameData
        const randomWord = gameData[Math.floor(Math.random() * gameData.length)];
        setCurrentWordData({
          headWord: randomWord.headWord,
          tranCn: randomWord.content.word.content.trans[0].tranCn,
        });
        setDisplayedWordData({
          headWord: randomWord.headWord,
          tranCn: randomWord.content.word.content.trans[0].tranCn,
        });
      }, 500); // Adjust interval as needed (500ms in this case)
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
