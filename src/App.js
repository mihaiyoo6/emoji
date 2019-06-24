import React from "react";
import * as posenet from "@tensorflow-models/posenet";
import "./App.css";
import emojiImg from "./glasses.svg";
import { isMobile, getDistance } from "./utils";

class App extends React.Component {
  state = {
    facingMode: true,
    showSwitchCamera: false,
    loading: true,
    error: false
  };
  video = React.createRef();
  canvas = React.createRef();
  emoji = React.createRef();

  async componentDidMount() {
    this.checkDevice();
    await this.capture();
    this.loadModel();
    this.resize();
  }

  loadModel = async () => {
    const net = await posenet.load({
      multiplier: isMobile() ? 0.5 : 0.75
    });
    this.setState({ net }, this.getPoses);
  };
  getPoses = async () => {
    const { net } = this.state;
    const poses = await net.estimatePoses(this.video, {
      flipHorizontal: this.state.facingMode,
      decodingMethod: "single-person"
    });

    this.drawPoint(poses[0].keypoints);
    requestAnimationFrame(this.getPoses);
  };
  checkDevice = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const showSwitchCamera =
      devices.filter(({ kind }) => kind === "videoinput").length > 1;
    this.setState({ showSwitchCamera });
  };
  capture = async () => {
    const { innerWidth, innerHeight } = window;
    const mobile = isMobile();
    const { facingMode, stream } = this.state;
    stream && stream.getTracks().forEach(t => t.stop());
    const videoStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: facingMode ? "user" : "environment",
        width: mobile ? undefined : innerWidth,
        height: mobile ? undefined : innerHeight
      }
    });

    this.video.srcObject = videoStream;
    this.setState({ stream: videoStream });
  };
  switch = () => {
    const { facingMode } = this.state;
    this.setState({ facingMode: !facingMode }, () => this.capture());
  };
  resize = () => {
    window.addEventListener("resize", () => this.capture());
  };
  drawPoint = poses => {
    const ctx = this.canvas.getContext("2d");

    if (!this.state.facingMode) {
      console.log({
        facingMode: this.state.facingMode,
        width: this.canvas.width
      });
      ctx.translate(this.canvas.width, 0);
      ctx.scale(-1, 1);
    }
    const points = {};
    poses
      .filter(({ part }) => ["leftEye", "rightEye"].includes(part))
      .forEach(({ part, position }) =>
        Object.assign(points, { [part]: position })
      );
    const distance = getDistance(points.leftEye, points.rightEye);
    const angle = Math.atan2(
      points.leftEye.y - points.rightEye.y,
      points.rightEye.x - points.leftEye.x
    );
    // console.log({ points, angle, distance });
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save(); // save current state
    ctx.translate(
      (points.leftEye.x + points.rightEye.x) / 2,
      (points.leftEye.y + points.rightEye.y) / 2
    ); // change origin
    ctx.rotate(-angle);
    ctx.drawImage(
      this.emoji,
      -distance * 1.2,
      -distance / 1.8,
      distance * 2.4,
      distance * 1.2
    );

    ctx.restore(); // restore original states (no rotation etc)
    poses
      .filter(({ part }) => ["leftEye", "rightEye"].includes(part))
      .forEach(({ part, position }) => {
        ctx.beginPath();
        ctx.arc(position.x, position.y, distance / 5, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.beginPath();
        const x = part === "leftEye" ? position.x + 5 : position.x - 5;
        ctx.arc(x, position.y + 5, distance / 10, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
      });
  };
  render() {
    const { showSwitchCamera } = this.state;
    const { innerWidth, innerHeight } = window;
    return (
      <div className="video-container">
        <video
          className={this.state.facingMode ? "selfie" : ""}
          ref={ref => {
            this.video = ref;
          }}
          autoPlay={true}
          width={innerWidth}
          height={innerHeight}
        />
        <canvas
          ref={ref => {
            this.canvas = ref;
          }}
          width={innerWidth}
          height={innerHeight}
        />
        {showSwitchCamera && (
          <button className="btn-switch" onClick={this.switch}>
            switch
          </button>
        )}
        <img
          className="hidden"
          src={emojiImg}
          alt="emoji"
          ref={ref => {
            this.emoji = ref;
          }}
        />
      </div>
    );
  }
}

export default App;
