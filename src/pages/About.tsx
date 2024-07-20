import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div>
      <h1>About Page</h1>
      <Link to="/">Go to Home Page</Link>
    </div>
  );
};

export default About;
