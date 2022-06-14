import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getSessionUser, logout } from '../../store/session';
import './ProfileButton.scss';

const ProfileButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef();
  const user = useSelector(getSessionUser);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const closeMenu = (e) => {
      if (!ref.current?.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  return (
    <div className="profileContainer" ref={ref}>
      <button
        className="btn transparent profileButton"
        type="button"
        onClick={() => setShowMenu(prev => !prev)}
      >
        <FontAwesomeIcon icon="fas fa-user" />
      </button>
      {showMenu && (
        <div
          className="profileMenu"
          role="menu"
          tabIndex={-1}
          onClick={e => e.stopPropagation()}
        >
          <p>
            Username:
            {' '}
            {user.username}
          </p>
          <p>
            Email:
            {' '}
            {user.email}
          </p>
          <button
            className="btn transparent logout"
            type="button"
            onClick={() => {
              dispatch(logout());
              navigate('/');
            }}
          >
            <span className="icon">
              <FontAwesomeIcon icon="fas fa-arrow-right-from-bracket" />
            </span>
            <span className="text">Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
