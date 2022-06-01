import React from 'react';
import { useSelector } from 'react-redux';
import { usersSelectors } from '../../store/users';

const Notification = ({ notification }) => {
  const { senderId, type, content, action } = notification;
  const sender = useSelector(state => usersSelectors.selectById(state, senderId));

  let displayText = `${sender.username} `;

  if (type === 'PARTY') {
    if (action === 'CREATE') {
      displayText += `created a new party: ${content.value}`;
    }
  }

  return (
    <p>
      {displayText}
    </p>
  );
};

export default Notification;
