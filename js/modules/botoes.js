
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
            text: 'Nenhuma tarefa foi excluída ainda!'
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
            text: 'Não há tarefas para esvaziar.'
        });
        return;
    }

    Swal.fire({
        title: 'Tem certeza?',
        text: "Esta ação irá apagar todas as tarefas excluídas permanentemente!",
        icon: 'warning',
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
