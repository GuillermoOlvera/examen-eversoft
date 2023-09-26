const PASSWORD_LOCALSTORAGE = 'todos-list';

document.addEventListener("DOMContentLoaded", () => {
    let todos = [];
    let filterType = 'all';
    let searchKeyword = '';

    // DOM elements
    const todosContainer = document.getElementById('todosContainer');
    const handleAddTodo = document.getElementById('handleAddTodo');
    const inputNewTodo = document.getElementById('inputNewTodo');
    const prioritySelect = document.getElementById('prioritySelect');
    const showAllButton = document.getElementById('showAll');
    const showCompletedButton = document.getElementById('showCompleted');
    const showNotCompletedButton = document.getElementById('showNotCompleted');
    const searchInput = document.getElementById('searchInput');


    handleAddTodo.addEventListener('click', () => {
        const todoText = inputNewTodo.value.trim();
        if (!todoText) return;

        const newTodo = {
            todo: todoText,
            finished: false,
            priority: prioritySelect.value,
        }

        todos.push(newTodo);

        inputNewTodo.value = '';
        saveTodosInLocalStorage();
        uploadTodosList();
    });

    const getTodos = () => {
        const list = JSON.parse(localStorage.getItem(PASSWORD_LOCALSTORAGE));
        return list || [];
    };

    const saveTodosInLocalStorage = () => {
        localStorage.setItem(PASSWORD_LOCALSTORAGE, JSON.stringify(todos));
    };

    const deleteTodo = (index) => {
        if (!confirm('¿Eliminar tarea?')) return;
        todos.splice(index, 1);
        saveTodosInLocalStorage();
        uploadTodosList();
    };

    const toogleTodoStatus = (index, checkbox) => {
        todos[index].finished = checkbox.checked;
        saveTodosInLocalStorage();
        uploadTodosList();
    };

    const editTodo = (index, editInput) => {
        const updatedText = editInput.value.trim();
        if (!updatedText) return;

        todos[index].todo = updatedText;
        saveTodosInLocalStorage();
        uploadTodosList();
    };

    const editPriority = (index, prioritySelect) => {
        const updatedPriority = prioritySelect.value;
        todos[index].priority = updatedPriority;
        saveTodosInLocalStorage();
        uploadTodosList();
    };

    const createTodoElement = (todo, index) => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.finished;
        checkbox.addEventListener('change', () => toogleTodoStatus(index, checkbox));

        const span = document.createElement('span');
        span.textContent = todo.todo;

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = todo.todo;
            editInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    editTodo(index, editInput);
                }
            });

            li.removeChild(span);
            li.removeChild(editButton);
            li.appendChild(editInput);
            editInput.focus();
        });

        const editPriorityButton = document.createElement('button');
        editPriorityButton.textContent = 'Editar Prioridad';
        editPriorityButton.addEventListener('click', () => {
            const prioritySelectEdit = document.createElement('select');
            const priorities = ['low', 'medium', 'high'];
            for (const priority of priorities) {
                const option = document.createElement('option');
                option.value = priority;
                option.textContent = priority;
                prioritySelectEdit.appendChild(option);
            }
            prioritySelectEdit.value = todo.priority;
            prioritySelectEdit.addEventListener('change', () => {
                editPriority(index, prioritySelectEdit);
            });

            li.removeChild(span);
            li.removeChild(editButton);
            li.removeChild(editPriorityButton);
            li.appendChild(prioritySelectEdit);
            prioritySelectEdit.focus();
        });


        const deleteButton = document.createElement('a');
        deleteButton.classList.add('delete');
        deleteButton.innerHTML = "&times;";
        deleteButton.href = "#";
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteTodo(index);
        });

        const priorityColor = getPriorityColor(todo.priority);
        li.style.backgroundColor = priorityColor || 'white';

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(editPriorityButton);
        li.appendChild(deleteButton);
        return li;
    };

    const searchTodos = () => {
        const searchKeyword = searchInput.value.trim().toLowerCase();

        return todos.filter(todo => {
            const todoText = todo.todo.toLowerCase();
            const matchesKeyword = todoText.includes(searchKeyword);

            // Aplica el filtro de completadas o no completadas
            if (filterType === 'completed' && !todo.finished) {
                return false;
            }
            if (filterType === 'notCompleted' && todo.finished) {
                return false;
            }

            return matchesKeyword;
        });
    };

    const uploadTodosList = () => {
        todosContainer.innerHTML = '';
        const filteredTodos = searchTodos();

        for (const [index, todo] of filteredTodos.entries()) {
            const todoElement = createTodoElement(todo, index);
            todosContainer.appendChild(todoElement);
        }
    };

    searchInput.addEventListener('input', () => {
        searchKeyword = searchInput.value.trim().toLowerCase();
        uploadTodosList();
    });

    showAllButton.addEventListener('click', () => {
        filterType = 'all';
        uploadTodosList();
    });

    showCompletedButton.addEventListener('click', () => {
        filterType = 'completed';
        uploadTodosList();
    });

    showNotCompletedButton.addEventListener('click', () => {
        filterType = 'notCompleted';
        uploadTodosList();
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low':
                return 'green';
            case 'medium':
                return 'yellow';
            case 'high':
                return '#CB3234';
            default:
                return 'white';
        }
    };

    todos = getTodos();
    uploadTodosList();
});