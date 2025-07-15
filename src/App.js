import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './Main/MainPage';
import Header from './Main/Header';
import Login from './Login/Login';
import BoardWrite from './Board/BoardWrite';
import { useState } from 'react';
import Signup from './Login/Signup';
import FindId from './Login/FindId';
import FindPassword from './Login/FindPassword';
import FloatingMenu from './Board/FloatingMenu'; // 플로팅 메뉴
import BoardList from './Board/BoardList';
import BoardDetail from './Board/BoardDetail';
import BoardEdit from './Board/BoardEdit';
import MyPage from './Login/MyPage';
import EditInfo from './Login/EditInfo';

function App() {
  const [selectedMenu, setSelectedMenu] = useState('/');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="App">
      <Header selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} setSelectedCategory={setSelectedCategory} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>

      <div className="main-container">
        <div className="board-wrapper">
          <div className="floating-wrapper">
            <FloatingMenu selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
          </div>

          <div className="content-wrapper">
            <Routes>
              <Route
                path="/"
                element={<MainPage selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />}
              />
              <Route
                path="/login"
                element={<Login selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} setIsLoggedIn={setIsLoggedIn}/>}
              />
              <Route
                path='/board'
                element={<BoardList selectedCategory={selectedCategory} />} 
              />
              <Route
                path="/write"
                element={<BoardWrite selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />}
              />
              <Route path="/board/:id" element={<BoardDetail />} />
              <Route path="/board/:id/edit" element={<BoardEdit setSelectedMenu={setSelectedMenu} />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/find-id" element={<FindId setSelectedMenu={setSelectedMenu}/>} />
              <Route path="/find-password" element={<FindPassword setSelectedMenu={setSelectedMenu}/>} />
              <Route path="/mypage" element={<MyPage setSelectedMenu={setSelectedMenu} />} />
              <Route path="/editinfo" element={<EditInfo/>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
