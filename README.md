```

import React from 'react';
import { useFBAuth, IFBAuthProps } from '../../hooks/use-fb-auth';

export const Facebook = (props: IFBAuthProps) => {
  const state = useFBAuth(props);

  return (
    <React.Fragment>
      {!state.isLoggedIn ? (
        <button onClick={state.login}>Login</button>
      ) : (
        <button onClick={state.logout}>Log out</button>
      )}
    </React.Fragment>
  );
};

Facebook.defaultProps = {
  language: 'EN',
  version: '3.1',
  fields: 'name',
};


```;
