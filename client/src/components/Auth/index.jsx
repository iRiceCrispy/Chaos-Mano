import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSessionUser } from '../../store/session';
import LoginForm from '../Forms/LoginForm';
import SignupForm from '../Forms/SignupForm';
import loginImg from '../../assets/login.png';
import signupImg from '../../assets/signup.png';
import './Auth.scss';

const Auth = ({ type }) => {
  const sessionUser = useSelector(getSessionUser);

  if (sessionUser) return <Navigate to="/dashboard" />;

  return (
    <div id="auth" className={`${type}`}>
      <Link className="btn transparent home" to="/">Home</Link>
      <img
        className={`authImage ${type}`}
        src={type === 'login' ? loginImg : signupImg}
        alt={type}
      />
      <div className="formContainer">
        {type === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
};

export default Auth;
