import React from 'react';
import Spline from '@splinetool/react-spline';

const SplineScene: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Spline
        scene="https://prod.spline.design/ZqUZ6CD7mGKIoEU6/scene.splinecode"
      />
    </div>
  );
};

export default SplineScene; 