import React, { Component } from 'react';

import EmotionPieChart from './EmotionPieChart';

import './InfoBar.css'

const mungeEmotionData = (e) => {
    const emotions = Object.entries(e);
    var ret = [];
    for (let [emotion, value] of emotions) {
        ret.push({
            name: emotion,
            value: value
        });
    }
    return ret;
}

class InfoBar extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        console.log(this.props.faces);
        return(
            <div className="InfoBar">
                <h1>Crowd Sentiment Analysis</h1>
                {this.props.faces ?
                    <div>
                        <p>{this.props.faces.current.count} faces in view (faces recognised right now)</p>
                        <p>{this.props.faces.history.count} total face impressions seen (total times that a face has been seen)</p>
                        <p>Processing time per frame {Math.round(this.props.faces.duration)} ms</p>
                        <h2>Overall Emotion Split</h2>
                        <p>This is a breakdown of the predominant emotion seen in the faces recognised by the processor</p>
                        <EmotionPieChart data={mungeEmotionData(this.props.faces.history.emotions)}/>
                    </div>
                :
                    <div>Starting...</div>
                }
            </div>
        )
    }
}

export default InfoBar;