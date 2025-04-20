"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export type UserContextType = {
  user: {
    _count: {
      followedBy: number;
    };
  };
  incrementFollowerCount: () => void;
  decrementFollowerCount: () => void;
};

const UserContext = createContext<null | UserContextType>(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUserContext must be used within a UserProvider");
  return context;
};

export const UserProvider = ({
  initialUser,
  children,
}: {
  children: ReactNode;
  initialUser: UserContextType["user"];
}) => {
  const [user, setUser] = useState(initialUser);

  const incrementFollowerCount = () => {
    setUser((prev) => ({
      ...prev,
      _count: {
        ...prev._count,
        followedBy: prev._count.followedBy + 1,
      },
    }));
  };

  const decrementFollowerCount = () => {
    setUser((prev) => ({
      ...prev,
      _count: {
        ...prev._count,
        followedBy: prev._count.followedBy - 1,
      },
    }));
  };

  return (
    <UserContext.Provider
      value={{ user, incrementFollowerCount, decrementFollowerCount }}
    >
      {children}
    </UserContext.Provider>
  );
};
