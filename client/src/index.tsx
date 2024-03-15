import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import moment from 'moment';

moment.updateLocale('en', { week: { dow: 1 } })

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);

