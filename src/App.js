import React from 'react';
import Calculator from './components/Calculator';
import './App.css';

/**
 * App - 복리계산기 메인 애플리케이션 컴포넌트
 */
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>간단 복리계산기</h1>
      </header>
      <main>
        <Calculator />
      </main>
    </div>
  );
}

export default App;
