import React, { createContext, useContext, useState, useEffect } from 'react';

// Criamos um contexto para o estado de autenticação do usuário
const AuthContext = createContext();

// Função para facilitar o uso do contexto
export function useAuth() {
  return useContext(AuthContext);
}

// Provedor de autenticação que engloba toda a aplicação
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Tentamos pegar os dados do usuário do localStorage quando o componente é montado
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUser(userData); // Armazena os dados do usuário quando ele faz login
    localStorage.setItem('user', JSON.stringify(userData)); // Salva no localStorage
  };

  const logout = () => {
    setUser(null); // Remove os dados do usuário quando ele sai
    localStorage.removeItem('user'); // Remove do localStorage
  };

  // Efeito para garantir que o estado de usuário seja carregado ao iniciar
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user)); // Persistir dados no localStorage
    } else {
      localStorage.removeItem('user'); // Remover se o usuário estiver deslogado
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
