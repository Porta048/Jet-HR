
import React, { useState, useEffect } from 'react';
import { calcolaStipendioNetto } from '../utils/taxCalculations';
import './SalaryCalculator.css';

/**
 * Componente CalcolatoreStipendio
 * 
 * Permette all'utente di inserire la RAL e visualizzare il calcolo del netto
 * con il dettaglio delle tasse e detrazioni secondo le normative 2025.
 */
const CalcolatoreStipendio = () => {
    // Stato per la Retribuzione Annua Lorda (RAL)
    const [ral, impostaRal] = useState(30000);
    // Stato per i risultati del calcolo
    const [risultato, impostaRisultato] = useState(null);

    // Effetto che ricalcola il netto ogni volta che la RAL cambia
    useEffect(() => {
        if (ral > 0) {
            // Eseguiamo il calcolo importato dalle utility
            impostaRisultato(calcolaStipendioNetto(Number(ral)));
        } else {
            impostaRisultato(null);
        }
    }, [ral]);

    // Gestore del cambiamento dell'input RAL
    const gestisciCambioRal = (e) => {
        impostaRal(e.target.value);
    };

    // Funzione di utilità per formattare gli importi in Euro
    const formattaValuta = (importo) => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(importo);
    };

    return (
        <div className="calculator-card">
            <div className="input-section">
                <label htmlFor="ral-input">Inserisci la tua RAL (Retribuzione Annua Lorda)</label>
                <div className="input-wrapper">
                    <input
                        id="ral-input"
                        type="number"
                        value={ral}
                        onChange={gestisciCambioRal}
                        placeholder="Es. 30000"
                        min="0"
                        step="1000"
                    />
                    <span className="currency-symbol">€</span>
                </div>
            </div>

            {risultato && (
                <div className="results-section">
                    <div className="summary-cards">
                        <div className="summary-card highlight">
                            <h3>Netto Mensile</h3>
                            <div className="amount">{formattaValuta(risultato.nettoMensile)}</div>
                            <span className="subtitle">su 13 mensilità</span>
                        </div>
                        <div className="summary-card">
                            <h3>Netto Annuo</h3>
                            <div className="amount">{formattaValuta(risultato.nettoAnnuo)}</div>
                        </div>
                    </div>

                    <div className="breakdown-section">
                        <h3>Dettaglio Tasse e Trattenute (2025)</h3>
                        <div className="breakdown-table">
                            <div className="breakdown-row">
                                <span>Contributi INPS (con eventuale sgravio)</span>
                                <span className="negative">- {formattaValuta(risultato.contributiInps)}</span>
                            </div>
                            <div className="breakdown-row">
                                <span>IRPEF Lorda</span>
                                <span className="info">{formattaValuta(risultato.irpefLorda)}</span>
                            </div>
                            <div className="breakdown-row">
                                <span>Detrazioni Lavoro Dipendente</span>
                                <span className="positive">+ {formattaValuta(risultato.detrazioniLavoro)}</span>
                            </div>

                            {risultato.detrazioneCuneoFiscale > 0 && (
                                <div className="breakdown-row">
                                    <span>Detrazione Cuneo Fiscale (20k-40k)</span>
                                    <span className="positive">+ {formattaValuta(risultato.detrazioneCuneoFiscale)}</span>
                                </div>
                            )}

                            {risultato.bonusTrattamentoIntegrativo > 0 && (
                                <div className="breakdown-row">
                                    <span>Trattamento Integrativo (Ex Bonus Renzi)</span>
                                    <span className="positive">+ {formattaValuta(risultato.bonusTrattamentoIntegrativo)}</span>
                                </div>
                            )}

                            <div className="breakdown-row">
                                <span>IRPEF Netta</span>
                                <span className="negative">- {formattaValuta(risultato.irpefNetta)}</span>
                            </div>
                            <div className="breakdown-row">
                                <span>Addizionale Regionale (Lombardia)</span>
                                <span className="negative">- {formattaValuta(risultato.addizionaleRegionale)}</span>
                            </div>
                            <div className="breakdown-row">
                                <span>Addizionale Comunale (Milano)</span>
                                <span className="negative">- {formattaValuta(risultato.addizionaleComunale)}</span>
                            </div>
                            <div className="breakdown-row total-row">
                                <span>Totale Trattenute</span>
                                <span className="negative">- {formattaValuta(risultato.totaleTrattenute)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalcolatoreStipendio;
