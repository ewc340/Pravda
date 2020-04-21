import React, { FunctionComponent } from 'react';
import './LogoBar.css';

export const LogoBar: FunctionComponent = () => {
  return (
    <div className='logo-bar-container'>
      <img src={require('assets/logo.png')} />
    </div>
  )
}