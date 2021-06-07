import React from 'react';

import './Vestibule.css';

import VestibulePanel from './VestibulePanel';
import MediaPreview from './MediaPreview';

function Vestibule(props) {

  return (
    <div className="vestibule-container">
      <MediaPreview
        dispatchMediaStreams={props.dispatchMediaStreams}/>
      <VestibulePanel />
    </div>
  );
}

export default Vestibule;