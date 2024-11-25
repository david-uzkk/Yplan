import React, { useState, useEffect, useCallback } from 'react';
import './MainPage.css';
import axios from 'axios';
import debounce from 'lodash/debounce';

const MainPage = () => {
  const [rotinas, setRotinas] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [filter, setFilter] = useState("");

  // Função para carregar rotinas do backend ao iniciar a página
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/routines');
        setRotinas(response.data);
      } catch (error) {
        console.error("Erro ao buscar rotinas:", error);
      }
    };
    fetchRoutines();
  }, []);

  // Função para carregar exercícios do backend
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/routines/exercises');
        setExercises(response.data);
      } catch (error) {
        console.error("Erro ao buscar exercícios:", error);
      }
    };
    fetchExercises();
  }, []);

  // Função para salvar rotinas no backend com debounce
  const saveRoutine = useCallback(
    debounce(async (updatedRoutines) => {
      try {
        await axios.patch('http://localhost:3000/api/routines/update', { rotinas: updatedRoutines });
        console.log("Auto-save realizado com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar rotinas:", error);
      }
    }, 1000), [] // 1000ms debounce delay
  );

  // Função para criar uma nova rotina e salvar no backend
  const handleCreateRoutine = async () => {
    const novaRotina = { id: Date.now(), nome: `Rotina ${rotinas.length + 1}`, usuarioId: 1 }; // Ajuste usuarioId conforme necessário
    const novasRotinas = [...rotinas, novaRotina];
    setRotinas(novasRotinas);
    await saveRoutine(novasRotinas);
  };

  // Função para excluir uma rotina e salvar no backend
  const handleDeleteRoutine = async (id) => {
    const novasRotinas = rotinas.filter(rotina => rotina.id !== id);
    setRotinas(novasRotinas);
    try {
      await axios.delete(`http://localhost:3000/api/routines/${id}`);
      console.log(`Rotina ${id} excluída com sucesso!`);
    } catch (error) {
      console.error("Erro ao excluir rotina:", error);
    }
  };

  // useEffect para observar mudanças no estado de rotinas e disparar o auto-save
  useEffect(() => {
    if (rotinas.length > 0) { // Apenas realiza auto-save se houver rotinas
      saveRoutine(rotinas);
    }
  }, [rotinas, saveRoutine]);

  // Filtro aplicado à lista de exercícios
  const filteredExercises = exercises.filter(exercise =>
    filter ? exercise.tipo.includes(filter) : true
  );

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
          <input
            type="text"
            placeholder="Filtrar por tipo..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="exercise-box">
            {filteredExercises.map((exercise) => (
              <div key={exercise.id} className="exercise-item">
                {exercise.nome} - {exercise.tipo}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
