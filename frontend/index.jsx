import React from 'react';
import ReactDOM from 'react-dom/client';
import Setup from './Setup';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Root() {
  const [ready, setReady] = React.useState(false);
  return ready ? <App /> : <Setup onCompleted={() => setReady(true)} />;
}

root.render(<Root />);
