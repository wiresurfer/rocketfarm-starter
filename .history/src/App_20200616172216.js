import React from 'react';
import logo from './logo.svg';
import { Button } from 'antd';
import Layout from './containers/_layout'
import './App.css';

function App() {
  return (
    <div className="App">
      <Layout>
        <Button> test</Button>
      </Layout>
    </div>
  );
}

export default App;
