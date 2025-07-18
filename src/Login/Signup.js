import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api/AxiosApi';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    userId: '',
    password: '',
    confirmPassword: '',
    nickName: '',
    email: '',
    emailCode: '', // 인증번호 입력
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  const [emailSent, setEmailSent] = useState(false);
  const [serverCode, setServerCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showMessage, setShowMessage] = useState('')

  const navigate = useNavigate();

  const nameRegex = /^[가-힣a-zA-Z\s]+$/;
  const idRegex = /^[a-zA-Z0-9]{4,20}$/;
  const pwRegex = /^(?=(?:.*[A-Za-z]|.*\d))(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    let newErrors = {};
    let newSuccess = {};

    if (name === 'name') {
      if (!nameRegex.test(value)) {
        newErrors.name = '이름은 한글 또는 영문만 입력 가능합니다.';
        newSuccess.name = '';
      } else {
        newSuccess.name = '✅ 올바른 이름 형식입니다.';
        newErrors.name = '';
      }
    }

    if (name === 'userId') {
      if (!idRegex.test(value)) {
        newErrors.userId = '아이디는 영문자와 숫자 4~20자여야 합니다.';
        newSuccess.userId = '';
      } else {
        newSuccess.userId = '✅ 형식이 올바른 아이디입니다.';
        newErrors.userId = '';
      }
    }

    if (name === 'password') {
      if (!pwRegex.test(value)) {
        newErrors.password = '비밀번호는 영문자 또는 숫자, 특수문자 포함 8자 이상이어야 합니다.';
        newSuccess.password = '';
      } else {
        newSuccess.password = '✅ 안전한 비밀번호입니다.';
        newErrors.password = '';
      }
    }

    if (name === 'confirmPassword' || name === 'password') {
      if (updatedForm.confirmPassword && updatedForm.password !== updatedForm.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        newSuccess.confirmPassword = '';
      } else if (updatedForm.confirmPassword) {
        newSuccess.confirmPassword = '✅ 비밀번호가 일치합니다.';
        newErrors.confirmPassword = '';
      }
    }

    if (name === 'nickName') {
      if (value.length < 2) {
        newErrors.nickName = '닉네임은 2자 이상이어야 합니다.';
        newSuccess.nickName = '';
      } else {
        newSuccess.nickName = '✅ 형식이 올바른 닉네임입니다.';
        newErrors.nickName = '';
      }
    }

    if (name === 'email') {
      if (!emailRegex.test(value)) {
        newErrors.email = '유효한 이메일 형식이 아닙니다.';
        newSuccess.email = '';
      } else {
        newSuccess.email = '✅ 이메일 형식이 올바릅니다.';
        newErrors.email = '';
      }
    }

    setErrors(prev => ({ ...prev, [name]: newErrors[name] || '' }));
    setSuccess(prev => ({ ...prev, [name]: newSuccess[name] || '' }));
  };


  const handleSendEmailCode = async () => {
    if (!emailRegex.test(form.email)) {
      setErrors(prev => ({ ...prev, email: '올바른 이메일을 입력해주세요.' }));
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/send-verification-code`, null, {
        params: { email: form.email }
      });
      setServerCode(res.data.code); // 실제 검증은 프론트에서 임시 보관 방식
      
      setShowMessage('emailSend')
      setEmailSent(true);

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowMessage('')
      }, 1000);
    } catch (err) {
      alert('이메일 전송 실패: ' + (err.response?.data || err.message));
    }
  };

  const handleVerifyEmailCode = () => {
    if (form.emailCode === serverCode) {
      
      setShowMessage('emailSuccess')
      setEmailVerified(true);
      
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowMessage('')
      }, 1000);
    } else {
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!nameRegex.test(form.name)) newErrors.name = '이름은 한글 또는 영문만 입력 가능합니다.';
    if (!idRegex.test(form.userId)) newErrors.userId = '아이디는 영문자와 숫자 4~20자여야 합니다.';
    if (!pwRegex.test(form.password)) newErrors.password = '비밀번호는 조건을 만족해야 합니다.';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!emailRegex.test(form.email)) newErrors.email = '유효한 이메일 형식이 아닙니다.';
    if (!emailVerified) newErrors.emailCode = '이메일 인증을 완료해주세요.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { confirmPassword, emailCode, ...signupData } = form;
      await axios.post(`${API_BASE_URL}/api/users/signup`, signupData);
      
      setShowMessage('signup')
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate('/login');
        setShowMessage('')
      }, 1000);
    } catch (error) {
      alert('회원가입 실패: ' + (error.response?.data || error.message));
    }
  };

  const checkUserIdDuplicate = async () => {
  if (!idRegex.test(form.userId)) {
    setErrors(prev => ({ ...prev, userId: '아이디는 영문자와 숫자 4~20자여야 합니다.' }));
    return;
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/api/users/check-userId`, {
      params: { userId: form.userId },
    });

    if (res.data.available) {
      setSuccess(prev => ({ ...prev, userId: '✅ 사용 가능한 아이디입니다.' }));
      setErrors(prev => ({ ...prev, userId: '' }));
    } else {
      setErrors(prev => ({ ...prev, userId: '❌ 이미 사용 중인 아이디입니다.' }));
      setSuccess(prev => ({ ...prev, userId: '' }));
    }
  } catch (err) {
    setErrors(prev => ({ ...prev, userId: '서버 오류로 아이디 확인 실패' }));
  }
};

  const checkNicknameDuplicate = async () => {
    if (form.nickName.length < 2) {
      setErrors(prev => ({ ...prev, nickName: '닉네임은 2자 이상이어야 합니다.' }));
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/check-nickname`, {
        params: { nickName: form.nickName },
      });

      if (res.data.available) {
        setSuccess(prev => ({ ...prev, nickName: '✅ 사용 가능한 닉네임입니다.' }));
        setErrors(prev => ({ ...prev, nickName: '' }));
      } else {
        setErrors(prev => ({ ...prev, nickName: '❌ 이미 사용 중인 닉네임입니다.' }));
        setSuccess(prev => ({ ...prev, nickName: '' }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, nickName: '서버 오류로 닉네임 확인 실패' }));
    }
  };


  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <input type="text" name="name" placeholder="이름" value={form.name} onChange={handleChange} />
        {errors.name && <div className="error-message">{errors.name}</div>}
        {success.name && <div className="success-message">{success.name}</div>}

        <div className="input-group">
          <input type="text" name="userId" placeholder="아이디" value={form.userId} onChange={handleChange} />
          <button type="button" className="check-button" onClick={checkUserIdDuplicate}>중복 확인</button>
        </div>
        {errors.userId && <div className="error-message">{errors.userId}</div>}
        {success.userId && <div className="success-message">{success.userId}</div>}

        <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={handleChange} />
        {errors.password && <div className="error-message">{errors.password}</div>}
        {success.password && <div className="success-message">{success.password}</div>}

        <input type="password" name="confirmPassword" placeholder="비밀번호 확인" value={form.confirmPassword} onChange={handleChange} />
        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        {success.confirmPassword && <div className="success-message">{success.confirmPassword}</div>}

        <div className="input-group">
          <input type="text" name="nickName" placeholder="닉네임" value={form.nickName} onChange={handleChange} />
          <button type="button" className="check-button" onClick={checkNicknameDuplicate}>중복 확인</button>
        </div>
        {errors.nickName && <div className="error-message">{errors.nickName}</div>}
        {success.nickName && <div className="success-message">{success.nickName}</div>}

        <div className="input-group">
          <input type="email" name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
          <button type="button" className="check-button" onClick={handleSendEmailCode}>인증번호 요청</button>
        </div>
        {errors.email && <div className="error-message">{errors.email}</div>}
        {success.email && <div className="success-message">{success.email}</div>}

        {emailSent && (
          <div className="input-group">
            <input
              type="text"
              name="emailCode"
              placeholder="인증번호 입력"
              value={form.emailCode}
              onChange={handleChange}
            />
            <button type="button" className="check-button" onClick={handleVerifyEmailCode}>인증 확인</button>
          </div>
        )}
        {errors.emailCode && <div className="error-message">{errors.emailCode}</div>}
        {emailVerified && <div className="success-message">✅ 이메일 인증 완료</div>}

        <button type="submit">회원가입</button>
      </form>
      <button className="back-login" onClick={() => navigate('/login')}>로그인 페이지로 이동</button>

      {showSuccessMessage && (
        <div className="toast-popup">
          {showMessage === 'signup' && 
            <>
              <span className="icon">✅</span>
              <span className="text">회원가입 성공!</span>
            </>
          }
          {showMessage === 'emailSend' && 
            <>
              <span className="icon">✅</span>
              <span className="text">인증번호 전송 성공!</span>
            </>
          }
          {showMessage === 'emailSuccess' && 
            <>
              <span className="icon">✅</span>
              <span className="text">인증번호 확인 성공!</span>
            </>
          }
        </div>
      )}
    </div>
  );
};

export default Signup;
