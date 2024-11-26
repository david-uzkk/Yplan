import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import './index.css'; 
import App from './App'; 
import reportWebVitals from './reportWebVitals'; 

const root = ReactDOM.createRoot(document.getElementById('root'));



// Renderiza a aplicação React no DOM
root.render(
  <React.StrictMode>
    <App /> {/* Componente principal da aplicação */}
  </React.StrictMode>
);

// Se você deseja começar a medir o desempenho da sua aplicação, pode passar uma função aqui
// Para registrar os resultados, por exemplo: reportWebVitals(console.log)
// Ou enviar para um endpoint de análise. Mais informações: https://bit.ly/CRA-vitals
reportWebVitals();
