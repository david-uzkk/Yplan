// src/components/MainPage.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MainPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/'); // Redireciona para o login se o usuário não estiver logado
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Bem-vindo ao yPlan!</h1>
      <p>Aqui você pode gerenciar suas rotinas de treino.</p>
    </div>
  );
}

export default MainPage;
