
import { calcolaStipendioNetto } from './taxCalculations.js';

// Casi di test con diverse RAL
const casiTest = [15000, 25000, 30000, 35000, 50000, 100000];

casiTest.forEach(ral => {
    console.log(`\n--- RAL: ${ral} ---`);
    const risultato = calcolaStipendioNetto(ral);
    console.log(`INPS: ${risultato.contributiInps.toFixed(2)}`);
    console.log(`Imponibile IRPEF: ${risultato.imponibileIrpef.toFixed(2)}`);
    console.log(`IRPEF Lorda: ${risultato.irpefLorda.toFixed(2)}`);
    console.log(`Detrazioni Lavoro: ${risultato.detrazioniLavoro.toFixed(2)}`);
    if (risultato.detrazioneCuneoFiscale > 0) {
        console.log(`Detrazione Cuneo: ${risultato.detrazioneCuneoFiscale.toFixed(2)}`);
    }
    if (risultato.bonusTrattamentoIntegrativo > 0) {
        console.log(`Bonus Integrativo: ${risultato.bonusTrattamentoIntegrativo.toFixed(2)}`);
    }
    console.log(`IRPEF Netta: ${risultato.irpefNetta.toFixed(2)}`);
    console.log(`Add. Reg.: ${risultato.addizionaleRegionale.toFixed(2)}`);
    console.log(`Add. Com.: ${risultato.addizionaleComunale.toFixed(2)}`);
    console.log(`Netto Annuo: ${risultato.nettoAnnuo.toFixed(2)}`);
    console.log(`Netto Mensile (13): ${risultato.nettoMensile.toFixed(2)}`);
});
