import { configureStore } from '@reduxjs/toolkit';

import session from './session';
import users from './users';
import parties from './parties';
import drops from './drops';
import notifications from './notifications';

const store = configureStore({
  reducer: {
    session,
    users,
    parties,
    drops,
    notifications,
  },
});

export default store;
