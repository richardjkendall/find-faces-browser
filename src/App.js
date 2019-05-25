import React, { Component } from 'react';
import Webcam from './Webcam';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Webcam/>
      </div>
    )
  }
}

export default App;
