// src/context/AuthContext.js

import React, { createContext, useContext, useState } from 'react';

// Criamos um contexto para o estado de autenticação do usuário
const AuthContext = createContext();

// Função para facilitar o uso do contexto
export function useAuth() {
  return useContext(AuthContext);
}

// Provedor de autenticação que engloba toda a aplicação
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData); // Armazena os dados do usuário quando ele faz login
  };

  const logout = () => {
    setUser(null); // Remove os dados do usuário quando ele sai
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
