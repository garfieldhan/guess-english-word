// src/components/WordGuessingGame.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Radio, Button, message, Checkbox, Divider } from 'antd';
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
  const [autoPlay, setAutoPlay] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;
  const checkAll = plainOptions.length === checkedList.length;

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
      setIsModalVisible(false);
      setIsGameStarted(true);
      message.success(`Game started with ${playerCount} player(s)!`);
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  };

  const isStartButtonDisabled = checkedList.length === 0;

  const onChange = (list) => {
    setCheckedList(list);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
  };

  const onAutoPlayChange = (e) => {
    setAutoPlay(e.target.checked);
  };

  // Render Player components based on playerCount
  const renderPlayers = () => {
    if (playerCount === 2) {
      // Top center and bottom center for 2 players
      const positions = [
        { position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' },
        { position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)' },
      ];
      return positions.map((position, index) => (
        <div key={index} style={{ ...position }}>
          <Player
            gameData={gameData}
            setDisplayedWordData={setDisplayedWordData}
            autoPlay={autoPlay}
            isGameStarted={isGameStarted}
            setIsGameStarted={setIsGameStarted}
          />
        </div>
      ));
    } else if (playerCount === 4) {
      // Four corners for 4 players
      const positions = [
        { position: 'absolute', top: '10px', left: '10px' }, // Top left
        { position: 'absolute', top: '10px', right: '10px' }, // Top right
        { position: 'absolute', bottom: '10px', left: '10px' }, // Bottom left
        { position: 'absolute', bottom: '10px', right: '10px' }, // Bottom right
      ];
      return positions.map((position, index) => (
        <div key={index} style={{ ...position }}>
          <Player
            gameData={gameData}
            setDisplayedWordData={setDisplayedWordData}
            autoPlay={autoPlay}
            isGameStarted={isGameStarted}
            setIsGameStarted={setIsGameStarted}
          />
        </div>
      ));
    }
    return null;
  };

  return (
    <div style={{ padding: '20px', position: 'relative', height: '100vh' }}>
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
        <Form
          form={form}
          layout="vertical"
          initialValues={{ playerCount: 1 }}
        >
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
          <CenterBox displayedWordData={displayedWordData} />
          {renderPlayers()}
        </div>
      )}
    </div>
  );
};

export default WordGuessingGame;
