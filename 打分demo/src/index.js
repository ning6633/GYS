import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import 'antd/dist/antd.css'
import RouterBase from './router/routerBase'
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import Store from './store/store'

function App() {
  return (
    <div className="App">
      <RouterBase />
    </div>
  );
}
ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
