// src/components/CenterBox.jsx
import React, { useState } from 'react';
import { Typography, Image } from 'antd';
import { SoundOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

const CenterBox = ({ displayedWordData, isRunning }) => {
  const [isChinese, setIsChinese] = useState(true);

  const handleTouchStart = () => {
    setIsChinese(false);
  };

  const handleTouchEnd = () => {
    setIsChinese(true);
  }

  // 播放发音
  const playAudio = () => {
    const audioUrl = `https://dict.youdao.com/dictvoice?audio=${displayedWordData.headWord}&type=1`;
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div
      id="center-box"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ textAlign: 'center', cursor: 'pointer' }}
    >
      {!isRunning && displayedWordData.picture && <Image
        width={100}
        src={displayedWordData.picture}
        preview={false}
      />}
      <Paragraph id="item-text" style={{ fontSize: '54px'}} >
        {isChinese ? displayedWordData.tranCn : displayedWordData.headWord}
      </Paragraph>
      <SoundOutlined onClick={(e) => { e.stopPropagation(); playAudio(); }} style={{ fontSize: '24px', cursor: 'pointer' }} />
    </div>
  );
};

export default CenterBox;
