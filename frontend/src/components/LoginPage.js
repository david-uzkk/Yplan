// src/components/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth(); // Obtém a função login do contexto
  const navigate = useNavigate(); // Hook para navegação

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email });
      login(response.data); // Atualiza o estado do usuário com os dados recebidos
      navigate('/main'); // Redireciona para a página principal
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setMessage('Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <div>
      <h1>yPlan - Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          E-mail:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Entrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginPage;
