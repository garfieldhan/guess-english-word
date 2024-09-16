import React, { useState, useEffect } from 'react';
import { Button } from 'antd';

const Player = ({ gameData, setDisplayedWordData, autoPlay, isGameStarted, setIsGameStarted }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentWordData, setCurrentWordData] = useState({ headWord: '', tranCn: '' });
  const [words, setWords] = useState([]); // Start with an empty list
  const [score, setScore] = useState(0); // Initialize score

  useEffect(() => {
    setWords(gameData); // Update the word list when gameData changes
  }, [gameData]);

  useEffect(() => {
    // Restart the scrolling effect when words are loaded
    if (isGameStarted && words.length > 0 && !isRunning) {
      toggleStartPause();
    }
  }, [words, isGameStarted]);

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
      setIsGameStarted(false); // Set the game as not started
    } else {
      if (words.length > 0) {
        const id = setInterval(() => {
          // Select a random word from the updated words list
          if (words.length > 0) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            setCurrentWordData({
              headWord: randomWord.headWord,
              tranCn: randomWord.content.word.content.trans[0].tranCn,
            });
            setDisplayedWordData({
              headWord: randomWord.headWord,
              tranCn: randomWord.content.word.content.trans[0].tranCn,
            });
          }
        }, 500); // Adjust interval as needed (500ms in this case)
        setIntervalId(id);
        setIsRunning(true);
        setIsGameStarted(true); // Set the game as started
      }
    }
  };

  const handleKill = () => {
    if (currentWordData.headWord) {
      // Remove the current word from the list
      const updatedWords = words.filter(word => word.headWord !== currentWordData.headWord);
      setWords(updatedWords);
      // Update the displayed word data
      setDisplayedWordData({ headWord: '', tranCn: '' });

      // Restart the scrolling effect
      clearInterval(intervalId);
      const id = setInterval(() => {
        if (updatedWords.length > 0) {
          const randomWord = updatedWords[Math.floor(Math.random() * updatedWords.length)];
          setCurrentWordData({
            headWord: randomWord.headWord,
            tranCn: randomWord.content.word.content.trans[0].tranCn,
          });
          setDisplayedWordData({
            headWord: randomWord.headWord,
            tranCn: randomWord.content.word.content.trans[0].tranCn,
          });
        }
      }, 500); // Adjust interval as needed (500ms in this case)
      setIntervalId(id);
      setIsRunning(true);
    }
  };

  const incrementScore = () => {
    setScore(score + 1);
  };

  const decrementScore = () => {
    setScore(score - 1);
  };

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, [intervalId]);

  return (
    <div className="player-container">
      <div>remain: {words.length}</div>
      <div className="button-container">
        <Button onClick={toggleStartPause}>
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={handleKill}>
          Kill
        </Button>
      </div>
      <div>Score: {score}</div> {/* Display the score */}
      <div className="button-container">
        <Button onClick={incrementScore}>+</Button>
        <Button onClick={decrementScore}>-</Button>
      </div>
    </div>
  );
};

export default Player;
