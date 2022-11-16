// React V17 及以前版本
// import React from 'react'
// import ReactDOM from 'react-dom'
// import App from './App'
// ReactDOM.render(<App />, document.getElementById('root'))

import React from 'react';
import App from './App'
import stores from './store/index.js';
import { Provider } from 'mobx-react';
import { createRoot } from 'react-dom/client';//更新后的写法
import { HashRouter } from "react-router-dom";
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<HashRouter>  
  <Provider {...stores}>
    <App />
  </Provider>
  </HashRouter>); 
   // 用hashRouter包裹组件，让子组件可以使用 useNavigate