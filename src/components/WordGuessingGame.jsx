import React, { useState, useEffect } from 'react';
import { Modal, Form, Radio, Button, message, Checkbox, Divider, Progress } from 'antd';
import CenterBox from './CenterBox';
import Player from './Player';

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['PEPXiaoXue3_1', 'PEPXiaoXue3_2', 'PEPXiaoXue4_1', 'PEPXiaoXue4_2'];
const defaultCheckedList = ['PEPXiaoXue3_1'];

const WordGuessingGame = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [playerCount, setPlayerCount] = useState(null);
  const [form] = Form.useForm();
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [gameData, setGameData] = useState([]);
  const [displayedWordData, setDisplayedWordData] = useState({ headWord: '', tranCn: '' });
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [words, setWords] = useState([]);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [boxPosition, setBoxPosition] = useState(null)

  const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;
  const checkAll = plainOptions.length === checkedList.length;

  // 在其他状态变量下方添加
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const moveToNextPlayer = () => {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % playerCount);
  };



  useEffect(() => {
    if (isGameStarted && words.length > 0) {
      startGame();
    }
  }, [isGameStarted, words]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { playerCount } = values;
      setPlayerCount(playerCount);

      const loadedData = [];
      for (const item of checkedList) {
        try {
          const response = await fetch(`/${item}.json`);
          const data = await response.json();
          loadedData.push(...data);
        } catch (error) {
          console.error('Error loading JSON file:', error);
        }
      }
      setGameData(loadedData);
      setWords(loadedData); // Initialize the words list for global scrolling
      setIsModalVisible(false);
      setIsGameStarted(true);
      if (playerCount === 1) {
        setBoxPosition({ transform: 'rotate(0deg)', top: '50vw', position: 'relative'})
      } else if (playerCount === 2 | playerCount === 3 | playerCount === 4) {
        setBoxPosition({ transform: 'rotate(180deg)', top: '50vw', position: 'relative'})
      }
      message.success(`Game started with ${playerCount} player(s)!`);
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  };

  const isStartButtonDisabled = checkedList.length === 0;

  // 添加 CSS 样式
  const progressStyle = {
    position: 'relative',
    top: '30vw',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50%',
    marginBottom: '10px'
  };

  const onChange = (list) => {
    setCheckedList(list);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
  };

  const onAutoPlayChange = (e) => {
    setAutoPlay(e.target.checked);
  };

  const startGame = () => {
    if (words.length > 0 && !isRunning) {
      const id = setInterval(() => {
        if (words.length > 0) {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          setDisplayedWordData({
            headWord: randomWord.headWord,
            tranCn: randomWord.content.word.content.trans[0].tranCn,
          });
        }
      }, 10);
      setIntervalId(id);
      setIsRunning(true);
    }
  };

  const pauseGame = () => {
    // Auto play sound when paused
    if (autoPlay && displayedWordData.headWord) {
      playAudioTwice(displayedWordData.headWord);
    }
    clearInterval(intervalId);
    setIsRunning(false);
    if (playerCount === 2 && currentPlayerIndex === 0) {
      setBoxPosition({ transform: 'rotate(0deg)', top: '50vw', position: 'relative'})
    } else if (playerCount === 2 && currentPlayerIndex === 1) {
      setBoxPosition({ transform: 'rotate(180deg)', top: '50vw', position: 'relative'})
    } else if (playerCount === 3 && currentPlayerIndex === 0) {
      setBoxPosition({ transform: 'rotate(0deg)', top: '50vw', position: 'relative'})
    } else if (playerCount === 3 && currentPlayerIndex === 1) {
      setBoxPosition({ transform: 'rotate(90deg)', top: '50vw', position: 'relative'})
    } else if (playerCount === 3 && currentPlayerIndex === 2) {
      setBoxPosition({ transform: 'rotate(180deg)', top: '50vw', position: 'relative'})
    } else if (playerCount === 4 && (currentPlayerIndex === 0 || currentPlayerIndex === 3)) {
      setBoxPosition({ transform: 'rotate(180deg)', top: '50vw', position: 'relative'})
    } else if (playerCount === 4 && (currentPlayerIndex === 1 || currentPlayerIndex === 2)) {
      setBoxPosition({ transform: 'rotate(0deg)', top: '50vw', position: 'relative'})
    }
  };

  const killWord = () => {
    if (displayedWordData.headWord) {
      const updatedWords = words.filter(word => word.headWord !== displayedWordData.headWord);
      setWords(updatedWords);
    }
  };

  const playAudio = (word) => {
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${word}&type=1`;
    const audio = new Audio(audioUrl);
    setTimeout(() => audio.play(), 500);
  };

  const playAudioTwice = (word) => {
    playAudio(word);
    setTimeout(() => playAudio(word), 1000);
  };

  // Render Player components based on playerCount
  const renderPlayers = () => {
    const positions = [];
    if (playerCount === 1) {
      positions.push({ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)' });
    } else if (playerCount === 2) {
      positions.push(
        { position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%) rotate(180deg)' },
        { position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }
      );
    } else if (playerCount === 3) {
      positions.push(
        { position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%) rotate(180deg)' },
        { position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)' },
        { position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%) rotate(90deg)' }
      );
    } else if (playerCount === 4) {
      positions.push(
        { position: 'absolute', top: '10px', left: '10px', transform: 'rotate(180deg)' },
        { position: 'absolute', top: '10px', right: '10px', transform: 'rotate(180deg)' },
        { position: 'absolute', bottom: '10px', left: '10px' },
        { position: 'absolute', bottom: '10px', right: '10px' }
      );
    }

    return positions.map((position, index) => (
      <div key={index} style={{ ...position }}>
        <Player
          gameData={gameData}
          setDisplayedWordData={setDisplayedWordData}
          isRunning={isRunning}
          startGame={startGame}
          pauseGame={pauseGame}
          killWord={killWord}
          currentPlayer={index}
          isActive={index === currentPlayerIndex} // 传递是否是当前玩家
          moveToNextPlayer={moveToNextPlayer} // 传递移动到下一个玩家的方法
        />
      </div>
    ));
  };


  return (
    <div style={{ padding: '20px', position: 'relative', height: '90vh' }}>
      <Modal
        title="Select Number of Players"
        open={isModalVisible}
        onOk={handleOk}
        closable={false}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk} disabled={isStartButtonDisabled}>
            Start Game
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" initialValues={{ playerCount: 1 }}>
          <Form.Item
            name="playerCount"
            label="Number of Players"
            rules={[{ required: true, message: 'Please select the number of players!' }]}
          >
            <Radio.Group>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
              <Radio value={3}>3</Radio>
              <Radio value={4}>4</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>

        <Divider />

        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          Check all
        </Checkbox>
        <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />

        <Divider />

        <Checkbox onChange={onAutoPlayChange} checked={autoPlay}>
          Auto Play
        </Checkbox>
      </Modal>

      {playerCount && (
        <div>
          <div style={progressStyle}>
            <Progress
              percent={(words.length / gameData.length) * 100}
              format={(percent) => `${words.length} words left`}
              status="active"
            />
          </div>
          <div style={boxPosition} ><CenterBox displayedWordData={displayedWordData} /></div>
          {renderPlayers()}
        </div>
      )}
    </div>
  );
};

export default WordGuessingGame;