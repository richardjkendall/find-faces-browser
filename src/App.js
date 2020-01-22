import React, { Component } from 'react';
import Webcam from './Webcam';
import InfoBar from './InfoBar';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faceSummary: 0
    };
  }

  callbackForWebcam(faces) {
    this.setState({
      faceSummary: faces
    });
  }

  render() {
    return (
      <div>
        <Webcam callback={this.callbackForWebcam.bind(this)} />
        <InfoBar faces={this.state.faceSummary} />
      </div>
    )
  }
}

export default App;
