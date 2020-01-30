import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';

import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

ReactDOM.render(
  <DndProvider backend={HTML5Backend}>
    <Router />
  </DndProvider>
  , document.getElementById('root'));
