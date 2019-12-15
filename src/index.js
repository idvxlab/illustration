import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './style/index.css';
import './style/svg.less';

import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

ReactDOM.render((
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>
), document.getElementById('root'));