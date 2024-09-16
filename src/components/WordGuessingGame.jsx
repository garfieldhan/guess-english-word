// src/components/WordGuessingGame.jsx
import React, { useState } from 'react';
import { Modal, Form, Radio, Button, message, Checkbox } from 'antd';
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
  const [gameData, setGameData] = useState([]); // Store the loaded JSON data
  const [displayedWordData, setDisplayedWordData] = useState({ headWord: '', tranCn: '' }); // Store the current word to display

  const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;
  const checkAll = plainOptions.length === checkedList.length;

  // Start game function to load and combine JSON data
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { playerCount } = values;
      setPlayerCount(playerCount);

      // Load and combine JSON data from selected checkboxes
      const loadedData = [];
      for (const item of checkedList) {
        try {
          const response = await fetch(`/${item}.json`); // Adjust path if necessary
          const data = await response.json();
          loadedData.push(...data); // Combine all data into one array
        } catch (error) {
          console.error('Error loading JSON file:', error);
        }
      }
      setGameData(loadedData);
      setIsModalVisible(false); // Close the modal only after loading data
      message.success(`Game started with ${playerCount} player(s)!`);
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  };

  // Disable the Start Game button if no checkbox is selected
  const isStartButtonDisabled = checkedList.length === 0;

  // Handle checkbox changes
  const onChange = (list) => {
    setCheckedList(list);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Modal
        title="Select Number of Players"
        open={isModalVisible}
        onOk={handleOk}
        closable={false} // Disable close button
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

        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          Check all
        </Checkbox>
        <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
      </Modal>

      {playerCount && (
        <div>
          <CenterBox displayedWordData={displayedWordData} />
          <Player gameData={gameData} setDisplayedWordData={setDisplayedWordData} />
        </div>
      )}
    </div>
  );
};

export default WordGuessingGame;
