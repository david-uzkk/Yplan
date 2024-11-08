// src/components/LoginPage.js

import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // Ajuste no endpoint para o caminho correto
      const response = await axios.post('http://localhost:3000/auth/login', { email });
      setMessage(`Login realizado com sucesso! Bem-vindo, ${response.data.email}`);
      // Redirecionamento ou outra ação após o login bem-sucedido
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
