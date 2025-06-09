
//Variavéis


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






//Header com data, hora e saudação

adicionarTarefaBtn.addEventListener('click', () => {
    if (NomeTarefa.value === "" || DescricaoTarefa.value === "" || DataVencimento.value === "" || HoraVencimento.value === "" || PrioridadeTarefa.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção!',
            text: 'Preencha todos os campos!',
            confirmButtonColor: "#ff00dd"
        });
        return;
    }

    const agora = new Date();
    const dataTarefa = new Date(`${DataVencimento.value}T${HoraVencimento.value}`);

    if (dataTarefa < agora) {
        Swal.fire({
            icon: 'error',
            title: 'Data inválida!',
            text: 'A tarefa não pode ser criada com data e hora no passado.',
                        confirmButtonColor: "#ff00dd"
        });
        return;
    }

    const taskList = document.querySelector('#taskList');
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item');

    const [ano, mes, dia] = DataVencimento.value.split('-');
    const [hora, minuto] = HoraVencimento.value.split(':');
    const dataCompleta = `${dia}/${mes}/${ano}`;
    const horaCompleta = `${hora}:${minuto}`;

    
        const taskHTML = `
    <h3>${NomeTarefa.value}</h3>
    <p>${DescricaoTarefa.value}</p>
    <p><strong>Vencimento:</strong> ${dataCompleta} às ${horaCompleta}</p>
    <p class="prioridade ${PrioridadeTarefa.value}">Prioridade: ${PrioridadeTarefa.value}</p>
    <div class="task-actions">
        <button class="complete-btn">Concluir</button>
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Excluir</button>
    </div>
    `;

    taskItem.innerHTML = taskHTML;
    taskList.appendChild(taskItem);

    taskItem.querySelector('.complete-btn').addEventListener('click', function () {
        marcarComoConcluida(this);
    });
    taskItem.querySelector('.edit-btn').addEventListener('click', function () {
        editarTarefa(this);
    });
    taskItem.querySelector('.delete-btn').addEventListener('click', function () {
        excluirTarefa(this);
    });

    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push({
        nome: NomeTarefa.value,
        descricao: DescricaoTarefa.value,
        dataVencimento: DataVencimento.value,
        horaVencimento: HoraVencimento.value,
        prioridade: PrioridadeTarefa.value,
        html: taskHTML
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Tarefa adicionada com sucesso!',
                    confirmButtonColor: "#ff00dd"
    });
    
    document.querySelector('#taskForm').reset();
    

    
});



const saudacaoHeader = document.getElementById('saudacaoHeader');

const formatarDataHora = () => {
    const agora = new Date();

    const diaHoje = agora.getDate().toString().padStart(2, '0');
    const mesHoje = (agora.getMonth() + 1).toString().padStart(2, '0');
    const anoHoje = agora.getFullYear();

    const hora = agora.getHours().toString().padStart(2, '0');
    const minuto = agora.getMinutes().toString().padStart(2, '0');
    const segundo = agora.getSeconds().toString().padStart(2, '0');

    let saudacao;
    if (agora.getHours() >= 6 && agora.getHours() < 12) {
        saudacao = 'Bom dia!';
    } else if (agora.getHours() >= 12 && agora.getHours() < 18) {
        saudacao = 'Boa tarde!';
    } else {
        saudacao = 'Boa noite!';
    }

    return {
        saudacao,
        dataCompleta: `${diaHoje}/${mesHoje}/${anoHoje}`,
        horario: `${hora}:${minuto}:${segundo}`
    };
};

const atualizarHeader = () => {
    const { saudacao, dataCompleta, horario } = formatarDataHora();
    saudacaoHeader.innerHTML = `<span>${saudacao}</span> <span>${dataCompleta} ${horario}</span>`;
};







//DOM

window.onload = function () {
    atualizarHeader();
    carregarTarefas();
};

setInterval(atualizarHeader, 1000);
atualizarHeader();

const carregarTarefas = () => {
    
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';  

    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    tarefas.forEach(tarefa => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = tarefa.html;

        if (tarefa.concluida) {
            taskItem.classList.add('concluida');
            const editBtn = taskItem.querySelector('.edit-btn');
            const deleteBtn = taskItem.querySelector('.delete-btn');
            if (editBtn) editBtn.disabled = true;
            if (deleteBtn) deleteBtn.disabled = true;
        }

        taskList.appendChild(taskItem);

        taskItem.querySelector('.complete-btn').addEventListener('click', function () {
            marcarComoConcluida(this);
        });
        taskItem.querySelector('.edit-btn').addEventListener('click', function () {
            editarTarefa(this);
        });
        taskItem.querySelector('.delete-btn').addEventListener('click', function () {
            excluirTarefa(this);
        });
    });
};









//Tarefas em geral

const marcarComoConcluida = (button) => {

   
        const taskItem = button.closest('.task-item');
    
        if (taskItem.classList.contains('concluida')) {
            Swal.fire({
                icon: 'info',
                title: 'Informação',
                text: 'Esta tarefa já foi concluída!',
                            confirmButtonColor: "#ff00dd"
            });
            return;
        }
        
        Swal.fire({
            title: 'Você tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, concluir!',
            cancelButtonText: 'Cancelar',
                        confirmButtonColor: "#ff00dd"
        }).then((result) => {
            
            if (result.isConfirmed) {
                taskItem.classList.add('concluida');
    
                const editBtn = taskItem.querySelector('.edit-btn');
                const deleteBtn = taskItem.querySelector('.delete-btn');
                editBtn.disabled = true;
                deleteBtn.disabled = true;
            
                const taskName = taskItem.querySelector('h3').textContent;
                let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
                const index = tarefas.findIndex(t => t.nome === taskName);
            
                if (index !== -1) {
                    tarefas[index].concluida = true;
                    tarefas[index].html = taskItem.innerHTML;
                }
            
                localStorage.setItem('tarefas', JSON.stringify(tarefas));
            
                setTimeout(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: 'Tarefa marcada como concluida!',
                                    confirmButtonColor: "#ff00dd"
                    });
                }, 200);
            }
          });
    
};



const editarTarefa = (button) => {
  const taskItem = button.closest('.task-item');
  const tituloAtual = taskItem.querySelector('h3').textContent;
  const descricaoAtual = taskItem.querySelector('p').textContent;

  Swal.fire({
    title: 'Altere o título da sua tarefa',
    input: 'text',
    inputValue: tituloAtual,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Próximo',
                confirmButtonColor: "#ff00dd",
    inputValidator: (value) => {
      if (!value || value.trim() === '') {
        return 'Insira um título válido!';
      }
      return null;
    }
  }).then((result) => {
    if (!result.isConfirmed) return;

    const novoTitulo = result.value.trim();

    Swal.fire({
      title: 'Altere a descrição da sua tarefa',
      input: 'textarea',
      inputValue: descricaoAtual,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
                  confirmButtonColor: "#ff00dd",
      confirmButtonText: 'Salvar',
      inputValidator: (value) => {
        if (!value || value.trim() === '') {

          return 'Insira uma descrição válida!';
        }
        return null;
      }
    }).then((resultDesc) => {
      if (!resultDesc.isConfirmed) return;

      const novaDescricao = resultDesc.value.trim();

 
      taskItem.querySelector('h3').textContent = novoTitulo;
      taskItem.querySelector('p').textContent = novaDescricao;

      let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
      const index = tarefas.findIndex(t => t.nome === tituloAtual);

      if (index !== -1) {
        tarefas[index].nome = novoTitulo;
        tarefas[index].descricao = novaDescricao;
      
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
      }

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Tarefa atualizada com sucesso!',
                    confirmButtonColor: "#ff00dd"
      });
    });
  });
};

const excluirTarefa = (button) => {
    Swal.fire({
        title: 'Você tem certeza?',
        text: "Você poderá restaurar a tarefa depois",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar',
                    confirmButtonColor: "#ff00dd"
    }).then((result) => {
        if (result.isConfirmed) {
            const taskItem = button.closest('.task-item');
            const taskName = taskItem.querySelector('h3').textContent;
            taskItem.remove();

            let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
            let tarefasExcluidas = JSON.parse(localStorage.getItem('tarefasExcluidas')) || [];

        
            const index = tarefas.findIndex(t => t.nome === taskName);
            if (index !== -1) {
                const tarefaExcluida = tarefas.splice(index, 1)[0];
                tarefasExcluidas.push(tarefaExcluida);
            }

            localStorage.setItem('tarefas', JSON.stringify(tarefas));
            localStorage.setItem('tarefasExcluidas', JSON.stringify(tarefasExcluidas));

            carregarTarefas();

            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Tarefa excluída com sucesso!',
                            confirmButtonColor: "#ff00dd"
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire("Cancelado", "Você cancelou a ação", "error");
            return;
        }
    });
};

const filtrarTarefas = (filtro) => {
    const tarefas = document.querySelectorAll('.task-item');

    tarefas.forEach(tarefa => {
        switch (filtro) {
            case 'todas':
                tarefa.style.display = 'block';
                break;

            case 'pendentes':
                tarefa.style.display = tarefa.classList.contains('concluida') ? 'none' : 'block';
                break;

            case 'concluidas':
                tarefa.style.display = tarefa.classList.contains('concluida') ? 'block' : 'none';
                break;
        }
    });
};


//Botões Filtro

ordenarAntiga.addEventListener('click', () => {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    tarefas.sort((a, b) => {
        const dataA = new Date(`${a.dataVencimento}T${a.horaVencimento}`);
        const dataB = new Date(`${b.dataVencimento}T${b.horaVencimento}`);
        return dataB - dataA;
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    document.getElementById('taskList').innerHTML = '';
    carregarTarefas();
});

ordenarRecente.addEventListener('click', () => {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    tarefas.sort((a, b) => {
        const dataA = new Date(`${a.dataVencimento}T${a.horaVencimento}`);
        const dataB = new Date(`${b.dataVencimento}T${b.horaVencimento}`);
        return dataA - dataB;
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    document.getElementById('taskList').innerHTML = '';
    carregarTarefas();
});

ordenarAltaBtn.addEventListener('click', () => {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const ordem = { alta: 0, media: 1, baixa: 2 };
    tarefas.sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade]);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    document.getElementById('taskList').innerHTML = '';
    carregarTarefas();
});

ordenarBaixaBtn.addEventListener('click', () => {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const ordem = { alta: 2, media: 1, baixa: 0 };
    tarefas.sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade]);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    document.getElementById('taskList').innerHTML = '';
    carregarTarefas();
});

const botaoRestaurar = document.getElementById('lixeiraBtn');
botaoRestaurar.addEventListener('click', () => {
    let tarefasExcluidas = JSON.parse(localStorage.getItem('tarefasExcluidas')) || [];

    if (tarefasExcluidas.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Informação',
            text: 'Nenhuma tarefa foi excluída ainda!',
                        confirmButtonColor: "#ff00dd"
        });
        return;
    }

    const listaTarefasHTML = tarefasExcluidas.map((tarefa, i) => {
        return `
            <div class="task-item modal-task-item">
                <h3>${tarefa.nome}</h3>
                <p>${tarefa.descricao || ''}</p>
                <p><strong>Vencimento:</strong> ${tarefa.dataVencimento || ''} às ${tarefa.horaVencimento || ''}</p>
                <p class="prioridade ${tarefa.prioridade || ''}">Prioridade: ${tarefa.prioridade || ''}</p>
                <div class="task-actions modal-task-actions">
                    <button class="restore-btn" data-index="${i}">Restaurar</button>
                </div>
            </div>
        `;
    }).join('');

    Swal.fire({
        title: 'Restaurar tarefa',
        html: `<div class="modal-task-list">${listaTarefasHTML}</div>`,
        showConfirmButton: false,
                    confirmButtonColor: "#ff00dd",
        showCloseButton: true,
        didOpen: () => {
            const container = Swal.getHtmlContainer();
            container.querySelectorAll('.restore-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));

                    // Pega as listas atualizadas
                    let tarefasExcluidas = JSON.parse(localStorage.getItem('tarefasExcluidas')) || [];
                    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

                    // Remove da excluída e adiciona na principal
                    const tarefaRestaurada = tarefasExcluidas.splice(index, 1)[0];
                    tarefas.push(tarefaRestaurada);

                    // Atualiza localStorage
                    localStorage.setItem('tarefas', JSON.stringify(tarefas));
                    localStorage.setItem('tarefasExcluidas', JSON.stringify(tarefasExcluidas));

                    // Atualiza interface
                    carregarTarefas();
                    Swal.close();

                    Swal.fire({
                        icon: 'success',
                        title: 'Tarefa restaurada!',
                        text: `"${tarefaRestaurada.nome}" foi restaurada com sucesso.`,
                        timer: 1500,
                                    confirmButtonColor: "#ff00dd",
                        showConfirmButton: false
                    });
                });
            });
        }
    });
});

const botaoEsvaziarLixeira = document.getElementById('botaoEsvaziarLixeira');

botaoEsvaziarLixeira.addEventListener('click', () => {
    let tarefasExcluidas = JSON.parse(localStorage.getItem('tarefasExcluidas')) || [];

    if (tarefasExcluidas.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Lixeira Vazia',
            text: 'Não há tarefas para esvaziar.',
                        confirmButtonColor: "#ff00dd"
        });
        return;
    }

    Swal.fire({
        title: 'Tem certeza?',
        text: "Esta ação irá apagar todas as tarefas excluídas permanentemente!",
        icon: 'warning',
                    confirmButtonColor: "#ff00dd",
        showCancelButton: true,
        confirmButtonText: 'Sim, esvaziar!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem('tarefasExcluidas', JSON.stringify([]));
            Swal.fire(
                'Lixeira esvaziada!',
                'Todas as tarefas excluídas foram removidas.',
                
            
                'success'
            );
        }
    });
});


//Tema Claro / Escuro
document.addEventListener('DOMContentLoaded', () =>{
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.body.classList.add(currentTheme);

    document.getElementById('toggle-theme').addEventListener('click', () => {

        const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';

        document.body.classList.remove ('light', 'dark');

        document.body.classList.add (newTheme);

        localStorage.setItem('theme', newTheme)
    });
});


