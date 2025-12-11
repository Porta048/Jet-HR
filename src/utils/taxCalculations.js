
/**
 * Calcola lo stipendio netto annuale e mensile partendo dalla RAL.
 * Basato sulle normative della Legge di Bilancio 2025.
 *
 * Ipotesi e Semplificazioni:
 * - Dipendente a tempo indeterminato.
 * - Residente a Milano (Lombardia).
 * - Nessuna agevolazione particolare (es. rientro cervelli).
 * - 13 mensilità (tredicesima inclusa).
 * - Addizionali regionali/comunali stimate sui valori 2024 (in attesa di delibere 2025).
 *
 * @param {number} ral - Retribuzione Annua Lorda
 * @returns {object} Oggetto contenente i dettagli del calcolo
 */
export function calcolaStipendioNetto(ral) {
  // 1. Calcolo Contributi INPS
  // L'aliquota standard a carico del dipendente è 9.19%.
  // Nel 2025, il taglio del cuneo fiscale per i redditi bassi (< 20.000€)
  // agisce come uno sgravio contributivo (riduzione dell'aliquota INPS).

  const aliquotaInpsStandard = 0.0919;
  let aliquotaInpsEffettiva = aliquotaInpsStandard;
  let esoneroContributivo = 0; // Risparmio dovuto al taglio del cuneo (se < 20k)

  // Logica Taglio Cuneo 2025 (Fascia < 20.000€ - Sgravio Contributivo)
  // - Fino a 8.500€: sgravio 7.1% (paga solo 2.09%)
  // - 8.500€ - 15.000€: sgravio 5.3% (paga solo 3.89%)
  // - 15.000€ - 20.000€: sgravio 4.8% (paga solo 4.39%)
  if (ral <= 8500) {
    aliquotaInpsEffettiva = aliquotaInpsStandard - 0.071;
  } else if (ral <= 15000) {
    aliquotaInpsEffettiva = aliquotaInpsStandard - 0.053;
  } else if (ral <= 20000) {
    aliquotaInpsEffettiva = aliquotaInpsStandard - 0.048;
  }
  // Se > 20.000€, l'aliquota torna piena (9.19%), ma scatta il beneficio fiscale dopo.

  let contributiInps = ral * aliquotaInpsEffettiva;

  // Calcoliamo quanto sarebbe stato senza sgravio per mostrare la differenza (opzionale)
  // o semplicemente usiamo il valore calcolato.
  // Per chiarezza nel codice, manteniamo il calcolo diretto.

  const imponibileIrpef = ral - contributiInps;

  // 2. Calcolo IRPEF Lorda (Scaglioni 2025 - Confermati 3 scaglioni)
  // - Fino a 28.000€: 23%
  // - 28.000€ - 50.000€: 35%
  // - Oltre 50.000€: 43%

  let irpefLorda = 0;

  if (imponibileIrpef <= 28000) {
    irpefLorda = imponibileIrpef * 0.23;
  } else if (imponibileIrpef <= 50000) {
    irpefLorda = 28000 * 0.23 + (imponibileIrpef - 28000) * 0.35;
  } else {
    irpefLorda =
      28000 * 0.23 + (50000 - 28000) * 0.35 + (imponibileIrpef - 50000) * 0.43;
  }

  // 3. Detrazioni Lavoro Dipendente (TUIR Art. 13)
  // Confermata la no-tax area a 8.500€ (detrazione minima aumentata).
  let detrazioneLavoro = 0;

  if (imponibileIrpef <= 15000) {
    detrazioneLavoro = 1955; // Aumentata per coprire fino a 8.500€ di no-tax area
    if (detrazioneLavoro < 690) detrazioneLavoro = 690; // Minimo garantito
  } else if (imponibileIrpef <= 28000) {
    detrazioneLavoro =
      1910 + 1190 * ((28000 - imponibileIrpef) / 13000);
  } else if (imponibileIrpef <= 50000) {
    detrazioneLavoro =
      1910 * ((50000 - imponibileIrpef) / 22000);
  } else {
    detrazioneLavoro = 0;
  }

  // 4. Bonus Trattamento Integrativo (ex Bonus Renzi) - 2025
  // Confermato per redditi fino a 28.000€ se l'IRPEF lorda > detrazioni lavoro.
  // Valore massimo: 1.200€ annui (100€ al mese).
  // Semplificazione: Lo aggiungiamo come "detrazione negativa" (credito) o voce a parte.
  // Qui lo sommiamo al netto per semplicità, ma tecnicamente è un credito.
  let bonusTrattamentoIntegrativo = 0;
  if (imponibileIrpef <= 15000) {
    // Sotto i 15k spetta pieno se c'è capienza fiscale (spesso no tax area, ma se lavora tutto l'anno spetta).
    // Se irpef lorda > detrazione lavoro, spetta.
    // Ma sotto 8.500 è no tax area.
    // Assumiamo spetti se > 8.500€
    if (imponibileIrpef > 8500) {
      bonusTrattamentoIntegrativo = 1200;
    }
  } else if (imponibileIrpef <= 28000) {
    // Tra 15k e 28k spetta se IRPEF lorda > detrazioni.
    // Semplifichiamo assegnandolo pieno per questa fascia nel prototipo.
    bonusTrattamentoIntegrativo = 1200;
  }

  // 5. Taglio Cuneo Fiscale 2025 (Fascia 20.000€ - 40.000€ - Detrazione Aggiuntiva)
  // Per i redditi tra 20k e 32k: detrazione aggiuntiva di 1.000€ (circa 80€/mese).
  // Tra 32k e 40k: decalage (riduzione progressiva) fino a zero.
  // Questa è una DETRAZIONE FISCALE dall'IRPEF, non uno sgravio contributivo.

  let detrazioneCuneoFiscale = 0;
  if (ral > 20000 && ral <= 32000) {
    detrazioneCuneoFiscale = 1000;
  } else if (ral > 32000 && ral <= 40000) {
    // Decalage lineare da 1000 a 0
    detrazioneCuneoFiscale = 1000 * ((40000 - ral) / 8000);
  }

  // Somma totale detrazioni
  const totaleDetrazioni = detrazioneLavoro + detrazioneCuneoFiscale;

  // Calcolo IRPEF Netta
  let irpefNetta = irpefLorda - totaleDetrazioni;
  if (irpefNetta < 0) irpefNetta = 0; // L'IRPEF non può essere negativa (incapienza)

  // 6. Addizionali (Regionale + Comunale)
  // Assumiamo aliquote 2024 in assenza di nuove delibere definitive per il 2025.

  // Regionale Lombardia
  let addizionaleRegionale = 0;
  if (imponibileIrpef <= 15000) {
    addizionaleRegionale = imponibileIrpef * 0.0123;
  } else if (imponibileIrpef <= 28000) {
    addizionaleRegionale = (15000 * 0.0123) + ((imponibileIrpef - 15000) * 0.0158);
  } else if (imponibileIrpef <= 50000) {
    addizionaleRegionale = (15000 * 0.0123) + ((28000 - 15000) * 0.0158) + ((imponibileIrpef - 28000) * 0.0172);
  } else {
    addizionaleRegionale = (15000 * 0.0123) + ((28000 - 15000) * 0.0158) + ((50000 - 28000) * 0.0172) + ((imponibileIrpef - 50000) * 0.0173);
  }

  // Comunale Milano (0.8%, esenzione sotto 23k)
  let addizionaleComunale = 0;
  if (imponibileIrpef > 23000) {
    addizionaleComunale = imponibileIrpef * 0.008;
  }

  // 7. Calcolo Netto Finale
  // Netto = RAL - INPS - IRPEF Netta - Addizionali + Bonus Integrativo
  const totaleTrattenute = contributiInps + irpefNetta + addizionaleRegionale + addizionaleComunale;
  const nettoAnnuo = ral - totaleTrattenute + bonusTrattamentoIntegrativo;
  const nettoMensile = nettoAnnuo / 13;

  return {
    ral,
    imponibileInps: ral,
    contributiInps,
    imponibileIrpef,
    irpefLorda,
    detrazioniLavoro: detrazioneLavoro,
    detrazioneCuneoFiscale, // Nuova voce 2025
    bonusTrattamentoIntegrativo, // Ex Bonus Renzi
    irpefNetta,
    addizionaleRegionale,
    addizionaleComunale,
    totaleTrattenute,
    nettoAnnuo,
    nettoMensile
  };
}
