
const cronometro = {
    intervalId: 0,
    tempo: 0,
    tempoLimiteCronometro: 0,
    iniciouCronometro: false,
    

};

let intervalId = 0;
let tempo = 0;
let tempoLimiteCronometro = 0;

let tempoConfig = "0000";

let iniciouCronometro = false;

const labelTempo = document.querySelector('.label-tempo');
const labelConfiguracaoTempo = document.querySelector('.configuracao-tempo');

const botoesNumero = document.querySelectorAll('.button-container .btn-numero');
const botaoClean = document.querySelector('.btn-clean');
const botaoCrono = document.querySelector('.btn-crono');
const botaoStart = document.querySelector('.btn-start');
const botaoPause = document.querySelector('.btn-pause');

botoesNumero.forEach( (botao) => {
    botao.addEventListener('click', apertaBotaoNumero);
});

botaoClean.addEventListener('click', function (event){
    tempoConfig = "0000";
    labelConfiguracaoTempo.textContent = '00:00';
});

botaoStart.addEventListener('click', iniciaCronometro);

botaoPause.addEventListener('click', pausaCronometro);

function iniciaCronometro(event){
    tempo = 0;
    labelTempo.textContent = `00 : 00 : 00`;

    const minutos = parseInt(tempoConfig.slice(0, 2));
    const segundos = parseInt (tempoConfig.slice(2, 4));

    tempoLimiteCronometro = minutos * 60 * 1000 + segundos * 1000;

    if (tempoLimiteCronometro === 0){
        return;
    }

    intervalId = setInterval( atualizaTempoCronometro, 10);

    botaoStart.textContent = "Stop";
    botaoStart.removeEventListener('click', iniciaCronometro);
    botaoStart.addEventListener('click', interrompeCronometro)    
}

function interrompeCronometro(){
    window.clearInterval(intervalId);
    botaoStart.textContent = "Start";
    botaoStart.removeEventListener('click', interrompeCronometro);
    botaoStart.addEventListener('click', iniciaCronometro);    
}

function pausaCronometro(){
    window.clearInterval(intervalId);
    botaoPause.textContent = "Run";
    botaoPause.removeEventListener('click', pausaCronometro);
    botaoPause.addEventListener('click', continuaCronometro);    
}

function continuaCronometro(){
    intervalId = setInterval( atualizaTempoCronometro, 10);
    botaoPause.textContent = "Pause";
    botaoPause.removeEventListener('click', continuaCronometro);
    botaoPause.addEventListener('click', pausaCronometro);        
}

function apertaBotaoNumero(event){
    const novoDigito = event.target.dataset['numero'];

    tempoConfig = tempoConfig + novoDigito;
    tempoConfig = tempoConfig.slice(1, tempoConfig.length);
    console.log(tempoConfig);

    labelConfiguracaoTempo.textContent = tempoConfig.slice(0, 2) + `:` + tempoConfig.slice(2, 4);
}

function atualizaTempoCronometro(){

    if (tempo === tempoLimiteCronometro){
        interrompeCronometro();
        return;
    }

    tempo = tempo + 10;
    
    const centesimoSegundo = (tempo/10)%100;
    const segundo = Math.floor(tempo/1000)%60;
    const minuto = Math.floor((tempo/1000)/60);

    labelTempo.textContent = `${minuto}`.padStart(2, '0') + ` : ` + `${segundo}`.padStart(2,'0') + ` : ` + `${centesimoSegundo}`.padStart(2,0) ;

};



