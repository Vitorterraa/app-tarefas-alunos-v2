
adicionarTarefaBtn.addEventListener('click', () => {
    if (NomeTarefa.value === "" || DescricaoTarefa.value === "" || DataVencimento.value === "" || HoraVencimento.value === "" || PrioridadeTarefa.value === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção!',
            text: 'Preencha todos os campos!'
        });
        return;
    }

    const agora = new Date();
    const dataTarefa = new Date(`${DataVencimento.value}T${HoraVencimento.value}`);

    if (dataTarefa < agora) {
        Swal.fire({
            icon: 'error',
            title: 'Data inválida!',
            text: 'A tarefa não pode ser criada com data e hora no passado.'
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