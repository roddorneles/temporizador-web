
const labelTempo = document.querySelector('.label-tempo');

const intervalId = setInterval( atualizaTempo, 10);

console.log(intervalId);

let tempo = 0;
let tempoLimite = 0;

function atualizaTempo(){

    tempo = tempo + 10;
    
    const centesimoSegundo = (tempo/10)%100;
    const segundo = Math.floor(tempo/1000)%60;
    const minuto = Math.floor((tempo/1000)/60);

    labelTempo.textContent = `${minuto}`.padStart(2, '0') + ` : ` + `${segundo}`.padStart(2,'0') + ` : ` + `${centesimoSegundo}`.padStart(2,0) ;
    
};

function atingiuLimite(tempo){
    return (tempo === tempoLimite);
}




