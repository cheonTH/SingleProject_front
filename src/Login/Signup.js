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
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = useNavigate();

  // 정규표현식
  const nameRegex = /^[가-힣a-zA-Z\s]+$/;
  const idRegex = /^[a-zA-Z0-9]{4,20}$/;
  const pwRegex = /^(?=(?:.*[A-Za-z]|.*\d))(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    let newErrors = {};
    let newSuccess = {};

    if (name === 'name') {
      !nameRegex.test(value)
        ? newErrors.name = '이름은 한글 또는 영문만 입력 가능합니다.'
        : newSuccess.name = '✅ 올바른 이름 형식입니다.';
    }

    if (name === 'userId') {
      !idRegex.test(value)
        ? newErrors.userId = '아이디는 영문자와 숫자 4~20자여야 합니다.'
        : newSuccess.userId = '✅ 형식이 올바른 아이디입니다.';
    }

    if (name === 'password') {
      !pwRegex.test(value)
        ? newErrors.password = '비밀번호는 영문자 또는 숫자, 그리고 특수문자를 포함해 8자 이상이어야 합니다.'
        : newSuccess.password = '✅ 안전한 비밀번호입니다.';
    }

    if (name === 'email') {
      !emailRegex.test(value)
        ? newErrors.email = '유효한 이메일 형식이 아닙니다.'
        : newSuccess.email = '✅ 올바른 이메일 형식입니다.';
    }

    if (name === 'nickName') {
      value.length < 2
        ? newErrors.nickName = '닉네임은 2자 이상이어야 합니다.'
        : newSuccess.nickName = '✅ 형식이 올바른 닉네임입니다.';
    }

    // 비밀번호 확인 일치 여부
    const pw = updatedForm.password;
    const confirmPw = updatedForm.confirmPassword;

    if (confirmPw && pw !== confirmPw) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    } else if (confirmPw && pw === confirmPw) {
      newSuccess.confirmPassword = '✅ 비밀번호가 일치합니다.';
    }

    setErrors(prev => ({ ...prev, [name]: newErrors[name] || '', confirmPassword: newErrors.confirmPassword || '' }));
    setSuccess(prev => ({ ...prev, [name]: newSuccess[name] || '', confirmPassword: newSuccess.confirmPassword || '' }));
  };


  const handleSignup = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!nameRegex.test(form.name)) newErrors.name = '이름은 한글 또는 영문만 입력 가능합니다.';
    if (!idRegex.test(form.userId)) newErrors.userId = '아이디는 영문자와 숫자 4~20자여야 합니다.';
    if (!pwRegex.test(form.password)) newErrors.password = '비밀번호는 영문자 또는 숫자, 그리고 특수문자를 포함해 8자 이상이어야 합니다.';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    if (!emailRegex.test(form.email)) newErrors.email = '유효한 이메일 형식이 아닙니다.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = form;
      await axios.post(`${API_BASE_URL}/api/users/signup`, signupData);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false); // 2초 후 메시지 숨기기
        navigate('/login');
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

        <input type="email" name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
        {errors.email && <div className="error-message">{errors.email}</div>}
        {success.email && <div className="success-message">{success.email}</div>}

        <button type="submit">회원가입</button>
      </form>
      <button className="back-login" onClick={() => navigate('/login')}>로그인 페이지로 이동</button>

      {showSuccessMessage && (
        <div className="toast-popup">
          <span className="icon">✅</span>
          <span className="text">회원가입 성공!</span>
        </div>
      )}
    </div>
  );
};

export default Signup;
