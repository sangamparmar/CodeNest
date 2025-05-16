import React from 'react';

// This is a minimal component with no dependencies to test rendering
const TestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Test Page</h1>
      <p>If you can see this, React is rendering correctly.</p>
    </div>
  );
};

export default TestPage;