import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile, loginWithWallet as apiLogin, registerWithWallet as apiRegister } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch (err) {
          console.warn("Auth session expired or invalid:", err.message);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  // `signed` = { walletAddress, message, signature } produced by the wallet flow.
  const login = async (signed) => {
    const res = await apiLogin(signed);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  // `payload` = profile fields + { walletAddress, message, signature }.
  const register = async (payload) => {
    const res = await apiRegister(payload);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (err) {
      console.error("Refresh user error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
