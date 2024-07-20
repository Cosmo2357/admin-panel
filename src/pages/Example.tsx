import React from 'react';
import { Link } from 'react-router-dom';

const Example: React.FC = () => {
  return (
    <div>
      <h1>Example Page</h1>
      <Link to="/">Go to Home Page</Link>
    </div>
  );
};

export default Example;
