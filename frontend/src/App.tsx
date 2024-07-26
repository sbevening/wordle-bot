import React from 'react';
import './App.css';

import "./components/wordleBoard/wordleBoard"
import WordleBoard from './components/wordleBoard/wordleBoard';
import WordleGame from './model/wordleGame';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WordleBoard game={new WordleGame(6)}/>
      </header>
    </div>
  );
}

export default App;
