import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import loginImg from '../../assets/login.png';
import signupImg from '../../assets/signup.png';

import './Auth.css';

const Auth = ({ type }) => (
  <div className={`auth content ${type}`}>
    <Link className='btn transparent home' to='/'>Home</Link>
    <img
      className={`authImage ${type}`}
      src={type === 'login' ? loginImg : signupImg}
      alt={type}
    />
    <div className='formContainer'>
      {type === 'login' ? <LoginForm /> : <SignupForm />}
    </div>
  </div>
);

export default Auth;
