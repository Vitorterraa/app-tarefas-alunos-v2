
const marcarComoConcluida = (button) => {

   
    const taskItem = button.closest('.task-item');

    if (taskItem.classList.contains('concluida')) {
        Swal.fire({
            icon: 'info',
            title: 'Informação',
            text: 'Esta tarefa já foi concluída!'
        });
        return;
    }
    
    Swal.fire({
        title: 'Você tem certeza?',
        text: "Você não poderá reverter isso!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, concluir!',
        cancelButtonText: 'Cancelar'
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
    cancelButtonText: 'Cancelar'
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
