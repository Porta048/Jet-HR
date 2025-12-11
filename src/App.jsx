
import React from 'react';
import CalcolatoreStipendio from './components/SalaryCalculator';
import './App.css';

/**
 * Componente Principale dell'Applicazione.
 * Gestisce il layout generale, includendo header, main content e footer.
 */
function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Calcolatore Stipendio Netto</h1>
        <p>Simulazione basata sulle normative 2025 (Milano, Tempo Indeterminato)</p>
      </header>
      <main>
        {/* Componente principale per il calcolo */}
        <CalcolatoreStipendio />
      </main>
      <footer className="app-footer">
        <p>
          Prototipo sviluppato per Jet HR -{' '}
          <a
            href="https://github.com/Porta048/Jet-HR"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            Vedi Repository GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
