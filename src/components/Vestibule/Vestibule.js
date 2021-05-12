import React from 'react';

import './Vestibule.css';

import VestibulePanel from './VestibulePanel';
import MediaPreview from './MediaPreview';

function Vestibule() {

  return (
    <div className="vestibule-container">
      <MediaPreview />
      <VestibulePanel />
    </div>
  );
}

export default Vestibule;