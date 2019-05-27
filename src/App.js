import React, { Component } from 'react';
import Webcam from './Webcam';
import InfoBar from './InfoBar';
import Logo from './Logo';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faceSummary: 0
    };
  }

  callbackForWebcam(faces) {
    //console.log(faces);
    this.setState({
      faceSummary: faces
    });
  }

  render() {
    return (
      <div>
        <Webcam callback={this.callbackForWebcam.bind(this)} />
        <InfoBar faces={this.state.faceSummary} />
        <Logo/>
      </div>
    )
  }
}

export default App;
