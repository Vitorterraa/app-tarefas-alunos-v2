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
