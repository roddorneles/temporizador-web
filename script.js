
let tempoConfig = "0000";

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
    tempoAtual: 0,
    tempoLimite: 0,
    ultimaChamada: null,
    iniciou: false,
    modo: 'crono',
    mudaModo: function () {
        if (relogio.modo === 'crono') {
            relogio.modo = 'tempo';
        }
        else if (relogio.modo === 'tempo') {
            relogio.modo = 'crono';
        }
        return relogio.modo;
    },
    inicia: function (tempoInicio, tempoLimite) {

        relogio.tempoAtual = tempoInicio;
        relogio.tempoLimite = tempoLimite;

        relogio.ultimaChamada = Date.now();

        relogio.iniciou = true;
        relogio.intervalId = window.setInterval(relogio.atualizaTempo, 10);

    },
    atualizaTempo: function () {

        const dt = Date.now() - relogio.ultimaChamada;

        if (relogio.modo === 'crono') {
            relogio.tempoAtual = relogio.tempoAtual + dt;
        }
        else if (relogio.modo === 'tempo') {
            relogio.tempoAtual = relogio.tempoAtual - dt;
        }
        relogio.ultimaChamada = Date.now();

        if (relogio.modo === 'crono' && relogio.tempoAtual >= relogio.tempoLimite) {
            relogio.interrompe();
        }
        if (relogio.modo === 'tempo' && relogio.tempoAtual <= 0) {
            relogio.tempoAtual = 0;
            relogio.interrompe();
            return;
        }

        console.log(relogio.tempoAtual);

        relogio.formatarSegundos();

        if (relogio.modo === 'crono' && Math.floor(relogio.tempoAtual / 1000) * 1000 >= relogio.tempoLimite) {
            relogio.interrompe();
        }

    },
    interrompe: function () {
        window.clearInterval(relogio.intervalId);
        relogio.iniciou = false;
        botaoStart.textContent = "Start";
        botaoStart.removeEventListener('click', clicaBotaoStop);
        botaoStart.addEventListener('click', clicaBotaoStart);
    },
    formatarSegundos: function () {
        const centesimoSegundo = Math.floor((relogio.tempoAtual % 1000) / 10);
        const segundo = Math.floor(relogio.tempoAtual / 1000) % 60;
        const minuto = Math.floor((relogio.tempoAtual / 1000) / 60);

        labelTempo.textContent = `${minuto}`.padStart(2, '0') + ` : ` + `${segundo}`.padStart(2, '0') + ` : ` + `${centesimoSegundo}`.padStart(2, 0);
    },
    pause: function () {
        window.clearInterval(relogio.intervalId);
    },
    continua: function () {
        relogio.ultimaChamada = Date.now();
        relogio.intervalId = window.setInterval(relogio.atualizaTempo, 10);
    }
};

botaoStart.addEventListener('click', clicaBotaoStart);

botaoPause.addEventListener('click', clicaBotaoPause);

botaoMudaModo.addEventListener('click', clicaBotaoMudaModo);

botoesNumero.forEach((botao) => {
    botao.addEventListener('click', apertaBotaoNumero);
});

botaoClean.addEventListener('click', function () {
    if (relogio.iniciou) {
        console.log("Tecla desabilitada");
        return;
    }

    tempoConfig = "0000";
    labelConfiguracaoTempo.textContent = '00 : 00';
});

function clicaBotaoStart() {
    console.log("Start");
    let minutos = parseInt(tempoConfig.slice(0, 2));
    let segundos = parseInt(tempoConfig.slice(2, 4));

    if (minutos > 59) {
        minutos = 59;
    }
    if (segundos > 59) {
        segundos = 59;
    }

    const tempoConfiguradoEmMs = minutos * 60 * 1000 + segundos * 1000;

    if (tempoConfiguradoEmMs === 0) {
        return;
    }

    if (relogio.modo === 'crono') {
        relogio.inicia(0, tempoConfiguradoEmMs);
    }
    else if (relogio.modo === 'tempo') {
        relogio.inicia(tempoConfiguradoEmMs, 0);
    }

    botaoStart.textContent = "Stop";
    botaoStart.removeEventListener('click', clicaBotaoStart);
    botaoStart.addEventListener('click', clicaBotaoStop);
}

function clicaBotaoStop() {
    console.log("Stop");
    relogio.interrompe();

    botaoPause.textContent = "Pause";
    botaoPause.removeEventListener('click', clicaBotaoRun);
    botaoPause.addEventListener('click', clicaBotaoPause);
}

function clicaBotaoRun() {
    if (!relogio.iniciou) {
        console.log("Tecla desabilitada");
        return;
    }
    console.log("Run");
    relogio.continua();
    botaoPause.textContent = "Pause";
    botaoPause.removeEventListener('click', clicaBotaoRun);
    botaoPause.addEventListener('click', clicaBotaoPause);
}

function clicaBotaoPause() {
    if (!relogio.iniciou) {
        console.log("Tecla desabilitada");
        return;
    }
    console.log("Pause");
    relogio.pause();
    botaoPause.textContent = "Run";
    botaoPause.removeEventListener('click', clicaBotaoPause);
    botaoPause.addEventListener('click', clicaBotaoRun);
}

function clicaBotaoMudaModo() {
    if (relogio.iniciou) {
        console.log("Tecla desabilitada");
        return;
    }
    const novoModo = relogio.mudaModo();
    if (novoModo === 'crono') {
        console.log("Crono");
        botaoMudaModo.textContent = 'CHRONOMETER';
    }
    if (novoModo === 'tempo') {
        console.log("Timer");
        botaoMudaModo.textContent = 'TIMER';
    }
}

function apertaBotaoNumero(event) {
    if (relogio.iniciou) {
        console.log("Tecla desabilitada");
        return;
    }

    const novoDigito = event.target.dataset['numero'];

    tempoConfig = tempoConfig + novoDigito;
    tempoConfig = tempoConfig.slice(1, tempoConfig.length);
    console.log(`Botao ${novoDigito}: ${tempoConfig}`);

    labelConfiguracaoTempo.textContent = tempoConfig.slice(0, 2) + ` : ` + tempoConfig.slice(2, 4);
}
