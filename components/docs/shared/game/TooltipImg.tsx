'use client'

import React, { Component, useState } from "react";

class Tooltip extends Component<any> {
  state = {
    xPosition: 0,
    yPosition: 0,
    mouseMoved: false,
    listenerActive: false
  };

  componentDidMount() {
    this.addListener();
  }

  componentDidUpdate() {
    if (!this.state.listenerActive && this.props.visible) {
      this.addListener();
    }

    if (this.state.listenerActive && !this.props.visible) {
      this.removeListener();
    }
  }

  componentWillUnmount() {
    this.removeListener();
  }

  // @ts-ignore
  onMouseMove = ({ clientX: xPosition, clientY: yPosition }) => {
    this.setState({
      xPosition,
      yPosition,
      mouseMoved: true
    });
  };

  addListener = () => {
    document.addEventListener("mousemove", this.onMouseMove);
    this.setState({ listenerActive: true });
  };

  removeListener = () => {
    document.removeEventListener("mousemove", this.onMouseMove);
    this.setState({ listenerActive: false });
  };

  render() {
    return (
      <div
        className="minetip-tooltip"
        style={{
          display: this.props.visible && this.state.mouseMoved ? "block" : "none",
          top: this.state.yPosition + this.props.offsetY,
          left: this.state.xPosition + this.props.offsetX
        }}
      >
        <span className="font-minecraft">{this.props.children}</span>
      </div>
    );
  }
}

export default function TooltipImg(props: any) {
  const [visible, setVisible] = useState(false);

  return <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
    <Tooltip
      visible={visible}
      offsetX={15}
      offsetY={-33}
    >
      {props.id}
    </Tooltip>
    {props.children}
  </div>;
}