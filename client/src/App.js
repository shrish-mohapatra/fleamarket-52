import React from 'react';
import Provider from './store/providers/Provider';

import 'antd/dist/antd.less';
import './App.less';

function App() {
  return (
    <div className="App">
      <Provider/>
    </div>
  );
}

export default App;
