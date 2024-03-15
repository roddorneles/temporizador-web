
let tempoConfig = "0000";
let tempoAcumulado = 0;

const labelTempo = document.querySelector('.label-tempo');
const labelTempoMinuto = document.querySelector('.label-minuto');
const labelTempoSegundo = document.querySelector('.label-segundo');
const labelTempoCentSegundo = document.querySelector('.label-centesimo-segundo');

const labelConfiguracaoTempo = document.querySelector('.configuracao-tempo');

const botoesNumero = document.querySelectorAll('.btn-numero');
const botaoClean = document.querySelector('.btn-clean');
const botaoMudaModo = document.querySelector('.btn-crono');
const botaoStart = document.querySelector('.btn-start');

const botaoPause = document.querySelector('.btn-pause');

const relogio = {
    intervalId: 0,
    tempo: 0,
    tempoLimite: 0,
    iniciou: false,
    modo: 'crono',
    mudaModo: function(){
        if (relogio.modo === 'crono'){
            relogio.modo = 'tempo';
        }
        else if (relogio.modo === 'tempo'){
            relogio.modo = 'crono';
        }
        return relogio.modo;
    },
    inicia: function (tempoInicio, tempoLimite){
        
        relogio.tempo = tempoInicio;
    
        relogio.tempoLimite = tempoLimite;

        relogio.iniciou = true;
        relogio.intervalId = window.setInterval( relogio.atualizaTempo, 10);

    },
    atualizaTempo: function (){
        
        if (relogio.tempo === relogio.tempoLimite){
            relogio.interrompe();
            return;
        }
        
        let incremento = 0;

        if (relogio.modo === 'crono'){
            incremento = 10;
        }
        else if (relogio.modo === 'tempo'){
            incremento = -10;
        }

        relogio.tempo = relogio.tempo + incremento;

        const centesimoSegundo = (relogio.tempo/10)%100;
        const segundo = Math.floor(relogio.tempo/1000)%60;
        const minuto = Math.floor((relogio.tempo/1000)/60);
    
        labelTempo.textContent = `${minuto}`.padStart(2, '0') + ` : ` + `${segundo}`.padStart(2,'0') + ` : ` + `${centesimoSegundo}`.padStart(2,0) ;
        
        //labelTempoMinuto.textContent = `${minuto}`.padStart(2, '0');
        //labelTempoSegundo.textContent = `${segundo}`.padStart(2,'0');
        //labelTempoCentSegundo.textContent = `${centesimoSegundo}`.padStart(2,0);
        
    },
    interrompe: function (){
        window.clearInterval(relogio.intervalId);
        relogio.iniciou = false;
        botaoStart.textContent = "Start";
        botaoStart.removeEventListener('click', clicaBotaoStop );
        botaoStart.addEventListener('click', clicaBotaoStart);    
    },
    pause: function (){
        if (!relogio.iniciou){
            console.log("Tecla desabilitada");
            return;
        }

        window.clearInterval(relogio.intervalId);
        botaoPause.textContent = "Run";
        botaoPause.removeEventListener('click', relogio.pause);
        botaoPause.addEventListener('click', relogio.continua);    
    },
    continua: function (){
        if (!relogio.iniciou){
            console.log("Tecla desabilitada");
            return;
        }        

        relogio.intervalId = window.setInterval( relogio.atualizaTempo, 10);
        botaoPause.textContent = "Pause";
        botaoPause.removeEventListener('click', relogio.continua);
        botaoPause.addEventListener('click', relogio.pause);        
    }
};

botaoStart.addEventListener('click', clicaBotaoStart);

botaoPause.addEventListener('click', relogio.pause);

botaoMudaModo.addEventListener('click', clicaBotaoMudaModo);

botoesNumero.forEach( (botao) => {
    botao.addEventListener('click', apertaBotaoNumero);
});

botaoClean.addEventListener('click', function (){
    if (relogio.iniciou){
        console.log("Tecla desabilitada");
        return;
    }    
    
    tempoConfig = "0000";
    labelConfiguracaoTempo.textContent = '00 : 00';
});

function clicaBotaoStart(){
    console.log("Start");
    let minutos = parseInt(tempoConfig.slice(0, 2));
    let segundos = parseInt (tempoConfig.slice(2, 4));

    if (minutos > 59){
        minutos = 59;
    }
    if (segundos > 59){
        segundos = 59;
    }

    const tempoConfiguradoEmMs = minutos * 60 * 1000 + segundos * 1000;

    if (tempoConfiguradoEmMs === 0){
        return;
    }

    if (relogio.modo === 'crono'){
        //labelTempo.textContent = `00 : 00 : 00`;
        relogio.inicia(0, tempoConfiguradoEmMs);
    }
    else if(relogio.modo === 'tempo'){
        //labelTempo.textContent = `00 : 00 : 00`;
        relogio.inicia(tempoConfiguradoEmMs, 0);
    }

    botaoStart.textContent = "Stop";
    botaoStart.removeEventListener('click', clicaBotaoStart);
    botaoStart.addEventListener('click', clicaBotaoStop);
}

function clicaBotaoStop(){
    console.log("Stop");
    relogio.interrompe();

    botaoPause.textContent = "Pause";
    botaoPause.removeEventListener('click', relogio.continua);
    botaoPause.addEventListener('click', relogio.pause);            
}

function clicaBotaoMudaModo(){
    if (relogio.iniciou){
        console.log("Tecla desabilitada");
        return;
    }    
    const novoModo = relogio.mudaModo();
    if (novoModo === 'crono'){
        console.log("Crono");
        botaoMudaModo.textContent = 'CHRONOMETER';
    }
    if (novoModo === 'tempo'){
        console.log("Timer");
        botaoMudaModo.textContent = 'TIMER';
    }
}

function apertaBotaoNumero(event){
    if (relogio.iniciou){
        console.log("Tecla desabilitada");
        return;
    }
    
    const novoDigito = event.target.dataset['numero'];

    tempoConfig = tempoConfig + novoDigito;
    tempoConfig = tempoConfig.slice(1, tempoConfig.length);
    console.log(`Botao ${novoDigito}: ${tempoConfig}`);

    labelConfiguracaoTempo.textContent = tempoConfig.slice(0, 2) + ` : ` + tempoConfig.slice(2, 4);
}

