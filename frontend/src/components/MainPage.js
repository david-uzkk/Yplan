import React from 'react';
import './MainPage.css'; 

const MainPage = () => {
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
          <button className="create-routine-button">Criar Nova Rotina</button>
          {/* Aqui adicionaremos a lista de rotinas */}
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
