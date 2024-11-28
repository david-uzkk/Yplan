import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import './style.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const { logout } = useAuth();  // Obtém o usuário e a função de logout do contexto
  const navigate = useNavigate();  // Hook para navegação
  const { user } = useAuth();

  const [rotinas, setRotinas] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedExercises, setSelectedExercises] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false); // Modal para criar exercício
  const [newExercise, setNewExercise] = useState({ nome: "", tipo: "" }); // Dados do novo exercício
  const [currentRoutineId, setCurrentRoutineId] = useState(null);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isSaving, setIsSaving] = useState(false); 
  const [error, setError] = useState(null); 

  // Função para salvar rotinas no backend com debounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveRoutine = useCallback(debounce(async (updatedRoutines) => {
    if (isSaving) return; // Impede múltiplas chamadas simultâneas
    setIsSaving(true); // Marca como "salvando"
    try {
      console.log("Rotinas para salvar:", updatedRoutines);
      const response = await axios.patch('http://localhost:3000/api/routines/update', { rotinas: updatedRoutines });
      console.log("Auto-save realizado com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao salvar rotinas:", error);
    } finally {
      setIsSaving(false); // Marca como "não salvando" quando terminar
    }
  }, 100)); 

  // Carregar rotinas
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        console.log('Buscando rotinas para o usuário:', user.id); // Verifique o id aqui
        const response = await axios.get(`http://localhost:3000/api/routines?userId=${user.id}`);
        console.log('Rotinas recebidas:', response.data); // Verifique os dados recebidos
        setRotinas(response.data);
        
        // Atualize selectedExercises com os exercícios das rotinas
        const newSelectedExercises = {};
        response.data.forEach((rotina) => {
          newSelectedExercises[rotina.id] = rotina.exercicios.map((exercicio) => exercicio.id);
        });
        setSelectedExercises(newSelectedExercises); // Atualiza selectedExercises com os exercícios
      } catch (error) {
        console.error("Erro ao buscar rotinas:", error);
      }
    };
  
    if (user.id) {
      fetchRoutines();
    }
  }, [user.id]); // Recarrega quando o user.id muda
  

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

      const updatedRoutines = rotinas.map(rotina => {
        if (rotina.id === rotinaId) {
          return { 
            ...rotina, 
            exercises: newSelectedExercises[rotinaId] 
          };
        }
        return rotina;
      });

      saveRoutine(updatedRoutines); // Envia para o backend
    }
  };

  // Remover exercício da rotina
  const removeExerciseFromRoutine = (rotinaId, exerciseId) => {
    const newSelectedExercises = { ...selectedExercises };
    if (newSelectedExercises[rotinaId]) {
      newSelectedExercises[rotinaId] = newSelectedExercises[rotinaId].filter(id => id !== exerciseId);
      setSelectedExercises(newSelectedExercises);

      const updatedRoutines = rotinas.map(rotina => {
        if (rotina.id === rotinaId) {
          return { 
            ...rotina, 
            exercises: newSelectedExercises[rotinaId] 
          };
        }
        return rotina;
      });

      saveRoutine(updatedRoutines); // Envia para o backend
    }
  };

  // Função para criar uma nova rotina
  const handleCreateRoutine = async () => {
    const novaRotina = { id: Date.now(), nome: `Rotina ${rotinas.length + 1}`, usuarioId: user.id }; 
    
    // Use a função de atualização do estado que recebe o estado anterior
    setRotinas((prevRotinas) => [...prevRotinas, novaRotina])
    
    
     // const novasRotinas = ; // Cria uma nova lista
      saveRoutine([novaRotina]); // Envia para o backend

  };

  // Função para excluir uma rotina
  const handleDeleteRoutine = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/routines/${id}`);
      if (response.status === 200 || response.status === 204) {
        console.log(`Rotina ${id} excluída com sucesso!`);
  
        const novasRotinas = rotinas.filter(rotina => rotina.id !== id);
        setRotinas(novasRotinas);
  
       // saveRoutine(novasRotinas); // Envia para o backend
      } else {
        console.error("Falha na exclusão da rotina:", response.data);
      }
    } catch (error) {
      console.error("Erro ao excluir rotina:", error.response?.data || error.message || error);
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

  // Função de logout
  const handleLogout = () => {
    setRotinas([]);
    localStorage.removeItem('user');
    logout();
    navigate('/');
  };

  const handleCreateExercise = async () => {
    try {
      // Envia a solicitação de criação do exercício para o backend
      const response = await axios.post('http://localhost:3000/api/routines/exercises', newExercise);
      setExercises([...exercises, response.data]); // Atualiza a lista local de exercícios
      setNewExercise({ nome: "", tipo: "" }); // Reseta os campos
      setShowCreateExerciseModal(false); // Fecha o modal
      console.log("Exercício criado com sucesso:", response.data);
    } catch (err) {
      if (err.response && err.response.data) {
        // Se o erro for proveniente do backend
        setError(err.response.data.message || "Erro desconhecido ao criar exercício.");
      } else {
        // Se for outro tipo de erro (como erro de rede)
        setError("Erro de rede ou servidor.");
      }
      console.error("Erro ao criar exercício:", err);

      // Configurar o timeout para limpar o erro após 3 segundos
      setTimeout(() => {
        setError(null); // Limpa o erro após 3 segundos
      }, 3000); 
    }
  };

    // Função para abrir o modal de edição/exclusão
    const openEditExerciseModal = (exercise) => {
      setSelectedExercise(exercise);  // Define o exercício selecionado
      setShowEditExerciseModal(true); // Abre o modal
    };    
  
    // Função para fechar o modal de edição/exclusão
    const closeEditExerciseModal = () => {
      setSelectedExercise(null);
      setShowEditExerciseModal(false);
    };
  
    // Função para salvar as alterações no exercício
    const handleEditExercise = async () => {
      try {
        const response = await axios.patch(
          `http://localhost:3000/api/routines/exercises/${Number(selectedExercise.id)}`, // Garante que id seja número
          {
            nome: selectedExercise.nome,
            tipo: selectedExercise.tipo,
          }
        );
        console.log("Exercício atualizado com sucesso:", response.data);
    
        // Atualiza a lista local de exercícios
        setExercises(
          exercises.map((ex) =>
            ex.id === selectedExercise.id ? response.data : ex
          )
        );
    
        closeEditExerciseModal();
      } catch (error) {
        console.error("Erro ao atualizar exercício:", error);
      }
    };
      
  
    // Função para excluir o exercício
    const handleDeleteExercise = async () => {
      try {
        await axios.delete(`http://localhost:3000/api/routines/exercises/${selectedExercise.id}`);
        console.log("Exercício excluído com sucesso!");
    
        // Atualiza a lista local de exercícios
        setExercises(exercises.filter(ex => ex.id !== selectedExercise.id));
    
        closeEditExerciseModal();
      } catch (error) {
        console.error("Erro ao excluir exercício:", error);
      }
    };    

  return (
    <div className="main-page">
      <header className="header">
        <h1>Ficha de Treino</h1>
        <button className="logout-button" onClick={handleLogout}>Sair</button>
      </header>

      <main className="content">
        <section className="routine-area">
          <h2>Suas Rotinas</h2>
          <button className="create-routine-button" onClick={handleCreateRoutine}>Criar Nova Rotina</button>
          <ul className="routine-list">
            {rotinas.map(rotina => (
              <li key={rotina.id} className="routine-item">
                <div className="routine-header">
                  <h3>{rotina.nome}</h3>
                  <button onClick={() => openModal(rotina.id)} className="add-exercise-button">Adicionar Exercício</button>
                  <button onClick={() => handleDeleteRoutine(rotina.id)} className="delete-routine-button">Excluir</button>
                </div>
                <ul className="exercise-list">
                  {selectedExercises[rotina.id] && selectedExercises[rotina.id].map(exerciseId => (
                    <li key={exerciseId} className="exercise-item">
                      {exercises.find(ex => ex.id === exerciseId)?.nome}
                      <button onClick={() => removeExerciseFromRoutine(rotina.id, exerciseId)} className="remove-exercise-button">Remover</button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section className="exercise-list">
          <h2>Lista de Exercícios</h2>
          <input type="text" placeholder="Filtrar por tipo..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          <button className="create-routine-button" onClick={() => setShowCreateExerciseModal(true)}>
            Criar Novo Exercício
          </button>
          <div className="exercise-box">
            {filteredExercises.map(exercise => (
              <div key={exercise.id} className="exercise-card">
                <h4>{exercise.nome}</h4>
                <p>{exercise.tipo}</p>
                <button onClick={() => openEditExerciseModal(exercise)} className="add-to-routine-button"> Editar/Excluir</button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Exibir alerta de erro, se houver */}
      {error && (
        <div className="alert-error">
          <p>{error}</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={closeModal} className="close-modal-button">X</button>
            <h2>Adicionar Exercício</h2>
            <div className="exercise-list">
              {filteredExercises.map((exercise) => (
                <div key={exercise.id} className="exercise-card">
                  <h4>{exercise.nome}</h4>
                  <p>{exercise.tipo}</p>
                  <button
                    onClick={() => addExerciseToRoutine(currentRoutineId, exercise.id)}
                    className="add-to-routine-button"
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal para criar exercício */}
      {showCreateExerciseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Criar Novo Exercício</h2>
            <input
              type="text"
              placeholder="Nome do exercício"
              value={newExercise.nome}
              onChange={(e) => setNewExercise({ ...newExercise, nome: e.target.value })}
            />
            <input
              type="text"
              placeholder="Tipo do exercício"
              value={newExercise.tipo}
              onChange={(e) => setNewExercise({ ...newExercise, tipo: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleCreateExercise}>Salvar</button>
              <button onClick={() => setShowCreateExerciseModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

            {/* Modal para editar/excluir exercício */}
      {showEditExerciseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar/Excluir Exercício</h2>
            <input
              type="text"
              placeholder="Nome do exercício"
              value={selectedExercise?.nome || ""}
              onChange={(e) =>
                setSelectedExercise({ ...selectedExercise, nome: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Tipo do exercício"
              value={selectedExercise?.tipo || ""}
              onChange={(e) =>
                setSelectedExercise({ ...selectedExercise, tipo: e.target.value })
              }
            />
            <div className="modal-actions">
              <button onClick={handleEditExercise} className="save-button">
                Salvar
              </button>
              <button onClick={handleDeleteExercise} className="delete-button">
                Excluir
              </button>
              <button onClick={closeEditExerciseModal} className="cancel-button">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
