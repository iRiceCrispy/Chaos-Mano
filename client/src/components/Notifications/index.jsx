import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { notificationsSelectors } from '../../store/notifications';
import Notification from './Notification';
import './Notifications.scss';

const Notifications = () => {
  const ref = useRef();
  const notifications = useSelector(notificationsSelectors.selectAll);
  const [count, setCount] = useState(0);
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

  useEffect(() => {
    const unreadNotifications = notifications.filter(noti => !noti.read);

    setCount(unreadNotifications.length);
  }, [notifications]);

  return (
    <div id="notificationsContainer" ref={ref}>
      <button
        className="btn transparent notificationButton"
        type="button"
        onClick={() => setShowMenu(prev => !prev)}
      >
        <FontAwesomeIcon icon="fa-solid fa-bell" />
      </button>
      {count > 0 && <span className="count">{count}</span>}
      {showMenu && (
        <ul
          className="notficationsMenu"
          role="menu"
          tabIndex={-1}
          onClick={e => e.stopPropagation()}
        >
          {notifications.map(notification => (
            <li className={`notification${notification.read ? '' : ' unread'}`} key={notification.id}>
              <Notification notification={notification} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
