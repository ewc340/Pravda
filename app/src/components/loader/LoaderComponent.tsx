import React from 'react'
import { Loader } from 'rimble-ui';
import './Loader.css'

export const LoaderComponent = () => {
  return (
    <div className={'loader'}>
      <Loader size="80px" color="black" />
      <h3> Loading...</h3>
    </div>
  );
}

