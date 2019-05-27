import React, { Component } from 'react';
//import graphlib from '@dagrejs/graphlib';

import { loadModels, getFullFaceDescription } from './face';

import './Webcam.css'

class Webcam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            faces: [],
            history: 0
        };
        this._v = 0;
        //this._g = new graphlib.Graph({directed: false});
        this._labels = [];
        this._descriptors = [];
    }

    async componentWillMount() {
        await loadModels();
    }

    componentDidMount() {
        if (navigator.mediaDevices.getUserMedia) {
            var _this = this;
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    _this._v.srcObject = stream;
                })
                .then(function () {
                    _this._v.addEventListener("play", () => {
                        console.log("now playing");
                        _this.runDetectLoop();
                    })
                })
                .catch(function (err) {
                    console.error(err);
                    console.log("Something went wrong!");
                });
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    summariseFaceData(data) {
        var count = data.length;
        var emotions = data.map((fd) => {
            const expressions = Object.entries(fd.expressions);
            var expression_hw = 0;
            var high_expression = "";
            for (const [expression, val] of expressions) {
                if (val > expression_hw) {
                    expression_hw = val;
                    high_expression = expression;
                }
            }
            return high_expression;
        });
        var emotionDict = {
            "angry": 0,
            "disgusted": 0,
            "fearful": 0,
            "happy": 0,
            "neutral": 0,
            "sad": 0,
            "surprised": 0
        };
        emotions.map((e) => {
            emotionDict[e]++;
        });
        return {
            count: count,
            emotions: emotionDict
        };
    }

    mergeSummaryAndHistory(summary) {
        var current = this.state.history;
        var emotionList = ["angry", "disgusted", "fearful", "happy", "neutral", "sad", "surprised"];
        if(current === 0) {
            return summary;
        } else {
            current.count += summary.count;
            for (let e of emotionList) {
                current.emotions[e] += summary.emotions[e];
            }
        }
        return current;
    }

    runDetectLoop() {
        console.log("running detect loop");
        const vidRect = this._v.getBoundingClientRect();
        const displaySize = { width: vidRect.width, height: vidRect.height };
        this.interval = setInterval(async () => {
            var start = window.performance.now();
            await getFullFaceDescription(this._v, displaySize)
                .then(fullDesc => {
                    var finish = window.performance.now();
                    /* all commented out because this is not working properly and it is not finished yet */
                    // call the matching face finder
                    //console.log("before call to face matcher, labels", this._labels, ", descriptors", this._descriptors);
                    //findMatchingFaces(fullDesc, this._labels, this._descriptors, this._g, 0.6);
                    //console.log("back from find matching faces, labels", this._labels, ", descriptors", this._descriptors);
                    //console.log("face graph", this._g);
                    //console.log("face graph components", graphlib.alg.components(this._g));
                    //console.log(fullDesc);
                    var summary = this.summariseFaceData(fullDesc);
                    //console.log(summary);
                    this.setState({
                        faces: fullDesc,
                        history: this.mergeSummaryAndHistory(summary)
                    });
                    this.props.callback({
                        current: summary,
                        history: this.state.history,
                        duration: finish - start
                    });
                });
        }, 200);
    }

    render() {
        const { faces } = this.state;
        var boxes = null;
        var labels = null;
        if(faces) {
            boxes = faces.map((face, i) => {
                var _H = face.detection.box.height;
                var _W = face.detection.box.width;
                var _X = face.detection.box._x;
                var _Y = face.detection.box._y;
                
                return (
                    <div key={"facebox" + i}>
                        <div style={{
                            position: "absolute",
                            border: "solid",
                            borderColor: "blue",
                            height: _H,
                            width: _W,
                            top: 0,
                            left: 0,
                            transform: `translate(${_X}px, ${_Y}px)`,
                            zIndex: 10
                        }}
                        />
                    </div>
                )
            });
            labels = faces.map((face, i) => {
                var _H = face.detection.box.height;
                var _X = face.detection.box._x;
                var _Y = face.detection.box._y;
                var _T = _H + _Y;
                const expressions = Object.entries(face.expressions);
                var expression_hw = 0;
                var high_expression = "";
                for (const [expression, val] of expressions) {
                    if (val > expression_hw) {
                        expression_hw = val;
                        high_expression = expression;
                    }
                }
                return (
                    <div key={"facelabel" + i}>
                        <p style ={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            transform: `translate(${_X}px, ${_T}px)`,
                            zIndex: 10,
                            backgroundColor: "blue",
                            color: "white",
                            padding: 0,
                            margin: 0,
                            marginTop: 5,
                            paddingBottom: 3,
                            fontSize: "16pt",
                            textTransform: "capitalize",
                            fontWeight: "bold"
                        }}
                        >&nbsp;{high_expression}&nbsp;</p>
                    </div>
                )
            });
        }
        return (
            <div>
                <video className="VideoBox" ref={(e) => { this._v = e }} autoPlay={true}></video>
                {boxes ? boxes : null}
                {labels ? labels : null}
            </div>
        )
    }
}

export default Webcam;