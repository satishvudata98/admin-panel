import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const logout = React.useCallback(() => setUser(null), []);
  const value = React.useMemo(() => ({ user, setUser, logout }), [user, setUser, logout]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

