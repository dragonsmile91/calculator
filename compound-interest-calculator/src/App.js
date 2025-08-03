import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calculator, Calendar, Trophy, TrendingUp, CalendarDays, Square } from 'lucide-react';
import CalculatorComponent from './components/Calculator';
import DDayCalculator from './components/DDayCalculator';
import LottoChecker from './components/LottoChecker';
import StockProfitCalculator from './components/StockProfitCalculator';
import HundredDayCalculator from './components/HundredDayCalculator';
import AreaCalculator from './components/AreaCalculator';
import './App.css';

/**
 * Header - 헤더 컴포넌트
 */
function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };

  return (
    <header className="App-header">
      <div className="header-content">
        <div className="menu-container">
          <button className="menu-button" onClick={toggleMenu}>
            <span className="menu-icon">☰</span>
          </button>
        </div>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Calculator size={32} style={{ marginRight: '0.5rem' }} />
          계산 도우미
        </h1>
        <div className="header-spacer"></div>
      </div>
      
      {/* 사이드 메뉴 오버레이 */}
      <div 
        className={`menu-overlay ${showMenu ? 'active' : ''}`}
        onClick={handleOverlayClick}
      >
        {/* 사이드 메뉴 */}
        <div className={`menu-dropdown ${showMenu ? 'active' : ''}`}>
          <div className="menu-header">
            <h3>메뉴</h3>
            <button className="menu-close" onClick={closeMenu}>
              ✕
            </button>
          </div>
          
          <Link to="/" className="menu-item" onClick={closeMenu}>
            복리계산기
          </Link>
          <Link to="/dday-calculator" className="menu-item" onClick={closeMenu}>
            D-Day 계산기
          </Link>
          <Link to="/stock-profit-calculator" className="menu-item" onClick={closeMenu}>
            주식 수익률 계산기
          </Link>
          <Link to="/hundred-day-calculator" className="menu-item" onClick={closeMenu}>
            100일 계산기
          </Link>
          <Link to="/area-calculator" className="menu-item" onClick={closeMenu}>
            평 계산기
          </Link>

        </div>
      </div>
    </header>
  );
}

/**
 * App - 메인 애플리케이션 컴포넌트
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<CalculatorComponent />} />
            <Route path="/dday-calculator" element={<DDayCalculator />} />
            <Route path="/stock-profit-calculator" element={<StockProfitCalculator />} />
            <Route path="/hundred-day-calculator" element={<HundredDayCalculator />} />
            <Route path="/area-calculator" element={<AreaCalculator />} />
            <Route path="/lotto-checker" element={<LottoChecker />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
