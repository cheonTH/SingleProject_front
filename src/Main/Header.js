import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({selectedMenu, setSelectedMenu, setSelectedCategory, isLoggedIn, setIsLoggedIn}) => {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("nickname");
    localStorage.removeItem("email");
    localStorage.removeItem("userPk");
    // 필요한 추가 정보도 제거
    setIsLoggedIn(false);
    setSelectedMenu('/');  // 홈으로 리다이렉트할 경우
    navigate('/')
    alert('로그아웃 되었습니다.');
  };

  return (
    <header className="header">
      {/* 왼쪽: 웹사이트 이름 */}
      <div className="header-title">
        <Link
          to="/"
          className="link"
          onClick={() => setSelectedMenu('/')}
        >
          <p>우리동네 자취생활</p>
        </Link>
      </div>

      {/* 중앙: 메뉴 */}
      <nav className="header-center">
        <Link
          to="/"
          className={`link ${['/', '/hunbab', '/coinwash', '/cafe'].includes(selectedMenu) ? 'active' : ''}`}
          onClick={() => setSelectedMenu('/')}
        >
          메인페이지
        </Link>
        <Link
          to="/board"
          className={`link ${['/board', '/write', '/detail', '/boardpop'].includes(selectedMenu) ? 'active' : ''}`}
          onClick={() => {setSelectedMenu('/board'); setSelectedCategory('all')}}
        >
          게시판
        </Link>
      </nav>

      {/* 오른쪽: 로그인 or 마이페이지/로그아웃 */}
      <div className="header-right">
        {isLoggedIn ? (
          <>
            <Link
              to="/mypage"
              className={`link ${['/mypage', '/editInfo'].includes(selectedMenu) ? 'active' : ''}`}
              onClick={() => setSelectedMenu('/mypage')}
            >
              마이페이지
            </Link>
            <button className="logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`link ${['/login', '/find-id', '/find-password'].includes(selectedMenu) ? 'active' : ''}`}
            onClick={() => setSelectedMenu('/login')}
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
