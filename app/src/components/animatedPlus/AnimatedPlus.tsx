// Credit to https://codepen.io/Inlesco/pen/XXRRmY. 
import React from 'react';
import './AnimatedPlus.css';

export const AnimatedPlus = () => {
  return (
    <div className="circle-plus closed">
      <div className="circle">
        <div className="horizontal"></div>
        <div className="vertical"></div>
      </div>
    </div>
  )
}