import React from 'react';
import { Switch } from 'antd';

const labelStyle = active => ({
  margin: '4px 10px',
  color: active ? '#1890ff' : 'rgba(0,0,0,0.25)'
})

const SwitchWithLabel = props => {
  let { checked } = props;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={labelStyle(!checked)}>定义动画</span>
      <Switch {...props} />
      <span style={labelStyle(checked)}>编辑目录</span>
    </div>
  )
}

export default SwitchWithLabel;