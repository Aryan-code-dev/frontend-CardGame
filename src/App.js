import React, { useState } from 'react';
import UsernameInput from './components/username/usernameInput';
import Card from './components/cardgame/Card';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [username, setUsername] = useState('');

  const handleUsernameSubmit = (name) => {
    setUsername(name);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<UsernameInput onUsernameSubmit={handleUsernameSubmit} />} />
          <Route path="/card" element={<Card username={username} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
