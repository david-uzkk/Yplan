// src/components/MainPage.js
import React, { useState } from 'react';
import './MainPage.css';

const MainPage = () => {
  const [rotinas, setRotinas] = useState([]);

  // Função para criar uma nova rotina
  const handleCreateRoutine = () => {
    const novaRotina = { id: Date.now(), nome: `Rotina ${rotinas.length + 1}` };
    setRotinas([...rotinas, novaRotina]);
  };

  // Função para excluir uma rotina
  const handleDeleteRoutine = (id) => {
    setRotinas(rotinas.filter(rotina => rotina.id !== id));
  };

  return (
    <div className="main-page">
      <header className="header">
        <h1>Ficha de Treino</h1>
        <button className="logout-button">Sair</button>
        <button className="delete-account-button">Excluir Conta</button>
      </header>

      <main className="content">
        <section className="routine-area">
          <h2>Suas Rotinas</h2>
          <button className="create-routine-button" onClick={handleCreateRoutine}>
            Criar Nova Rotina
          </button>
          <ul>
            {rotinas.map(rotina => (
              <li key={rotina.id}>
                {rotina.nome}
                <button onClick={() => handleDeleteRoutine(rotina.id)}>Excluir</button>
              </li>
            ))}
          </ul>
        </section>

        <section className="exercise-list">
          <h2>Lista de Exercícios</h2>
          {/* Aqui listaremos os exercícios */}
        </section>
      </main>
    </div>
  );
};

export default MainPage;
