

const NomeTarefa = document.getElementById('taskName');
const DescricaoTarefa = document.getElementById('taskDescription');
const DataVencimento = document.getElementById('taskDate');
const HoraVencimento = document.getElementById('taskTime');
const adicionarTarefaBtn = document.getElementById('adicionarTarefaBtn');
const ordenarRecente = document.getElementById('ordenarRecentesBtn');
const ordenarAntiga = document.getElementById('ordenarAntigasBtn');
const PrioridadeTarefa = document.getElementById('taskPriority');
const ordenarAltaBtn = document.getElementById('ordenarAltaBtn');
const ordenarBaixaBtn = document.getElementById('ordenarBaixaBtn');

let tarefasExcluidas = JSON.parse(localStorage.getItem('tarefasExcluidas')) || [];


