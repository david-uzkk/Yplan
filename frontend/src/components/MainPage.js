import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainPage.css';

const MainPage = () => {
  const [rotinas, setRotinas] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedExercises, setSelectedExercises] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentRoutineId, setCurrentRoutineId] = useState(null);

  // Carregar rotinas
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

  // Carregar exercícios
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

  // Filtro aplicado aos exercícios
  const filteredExercises = exercises.filter(exercise =>
    filter ? exercise.tipo.includes(filter) : true
  );

  // Adicionar exercício à rotina
  const addExerciseToRoutine = (rotinaId, exerciseId) => {
    const newSelectedExercises = { ...selectedExercises };
    if (!newSelectedExercises[rotinaId]) {
      newSelectedExercises[rotinaId] = [];
    }
    if (!newSelectedExercises[rotinaId].includes(exerciseId)) {
      newSelectedExercises[rotinaId].push(exerciseId);
      setSelectedExercises(newSelectedExercises);
    }
  };

  // Remover exercício da rotina
  const removeExerciseFromRoutine = (rotinaId, exerciseId) => {
    const newSelectedExercises = { ...selectedExercises };
    if (newSelectedExercises[rotinaId]) {
      newSelectedExercises[rotinaId] = newSelectedExercises[rotinaId].filter(id => id !== exerciseId);
      setSelectedExercises(newSelectedExercises);
    }
  };

  // Abrir modal para adicionar exercício
  const openModal = (rotinaId) => {
    setCurrentRoutineId(rotinaId);
    setShowModal(true);
  };

  // Fechar modal
  const closeModal = () => {
    setShowModal(false);
    setCurrentRoutineId(null);
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
          <ul className="routine-list">
            {rotinas.map(rotina => (
              <li key={rotina.id} className="routine-item">
                <div className="routine-header">
                  <h3>{rotina.nome}</h3>
                  <button onClick={() => openModal(rotina.id)} className="add-exercise-button">
                    Adicionar Exercício
                  </button>
                </div>
                <ul className="exercise-list">
                  {selectedExercises[rotina.id] && selectedExercises[rotina.id].map(exerciseId => (
                    <li key={exerciseId} className="exercise-item">
                      {exercises.find(ex => ex.id === exerciseId)?.nome}
                      <button onClick={() => removeExerciseFromRoutine(rotina.id, exerciseId)} className="remove-exercise-button">
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
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
            {filteredExercises.map(exercise => (
              <div key={exercise.id} className="exercise-card">
                <h4>{exercise.nome}</h4>
                <p>{exercise.tipo}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adicionar Exercício</h2>
            <button onClick={closeModal} className="close-modal-button">Fechar</button>
            <div className="exercise-list">
              {filteredExercises.map(exercise => (
                <div key={exercise.id} className="exercise-card">
                  <h4>{exercise.nome}</h4>
                  <p>{exercise.tipo}</p>
                  <button onClick={() => addExerciseToRoutine(currentRoutineId, exercise.id)} className="add-to-routine-button">
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
