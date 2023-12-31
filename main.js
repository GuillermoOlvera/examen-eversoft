// Constante para el nombre del Local Storage
const LOCAL_STORAGE_KEY = 'todos-list';

// Función principal que se ejecuta cuando el contenido DOM está listo
document.addEventListener("DOMContentLoaded", () => {
    let todos = [];
    let filterType = 'all';
    let searchKeyword = '';

    // Obtener elementos del DOM
    const todosContainer = document.getElementById('todosContainer');
    const handleAddTodo = document.getElementById('handleAddTodo');
    const inputNewTodo = document.getElementById('inputNewTodo');
    const prioritySelect = document.getElementById('prioritySelect');
    const showAllButton = document.getElementById('showAll');
    const showCompletedButton = document.getElementById('showCompleted');
    const showNotCompletedButton = document.getElementById('showNotCompleted');
    const searchInput = document.getElementById('searchInput');


    const handleAddButtonClick = () => {
        const todoText = inputNewTodo.value.trim();
        if (!todoText) return;

        // Crear una nueva tarea y agregarla al arreglo de tareas
        const newTodo = {
            todo: todoText,
            finished: false,
            priority: prioritySelect.value,
        }
        todos.push(newTodo);

        // Limpiar el campo de entrada
        inputNewTodo.value = '';

        // Guardar la lista de tareas en el Local Storage y actualizar la vista
        saveTodosInLocalStorage();
        filterTodosAndRender();
    }

    // Event listener para agregar una nueva tarea
    handleAddTodo.addEventListener('click', handleAddButtonClick);

    // Función para obtener la lista de tareas desde el Local Storage
    const getTodosFromLocalStorage = () => {
        const storedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        return storedTodos || [];
    };

    // Función para guardar la lista de tareas en el Local Storage
    const saveTodosInLocalStorage = () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    };

    // Función para eliminar una tarea
    const deleteTodoAtIndex = (index) => {
        if (!confirm('¿Eliminar tarea?')) return;
        todos.splice(index, 1);
        saveTodosInLocalStorage();
        filterTodosAndRender();
    };

    // Función para cambiar el estado de una tarea (completada o no)
    const toggleTodoStatusAtIndex = (index, checkbox) => {
        todos[index].finished = checkbox.checked;
        saveTodosInLocalStorage();
        filterTodosAndRender();
    };

    // Función para editar una tarea
    const editTodoAtIndex = (index, editForm) => {
        const updatedText = editForm.querySelector('.edit-text').value.trim();
        const updatedPriority = editForm.querySelector('.edit-priority').value;

        if (!updatedText) return;

        todos[index].todo = updatedText;
        todos[index].priority = updatedPriority;

        saveTodosInLocalStorage();
        filterTodosAndRender();
    };

    // Función para crear un elemento de tarea en el DOM
    const createTodoElement = (todo, index) => {
        const listItem = document.createElement('li');
        const todoCheckbox = document.createElement('input');
        const todoText = document.createElement('span');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('a');
        const editForm = document.createElement('form');

        // Configurar elementos y eventos aquí
        todoCheckbox.type = 'checkbox';
        todoCheckbox.checked = todo.finished;
        todoCheckbox.addEventListener('change', () => toggleTodoStatusAtIndex(index, todoCheckbox));

        todoText.textContent = todo.todo;

        editButton.textContent = 'Editar';

        editButton.addEventListener('click', () => {
            const editText = document.createElement('input');
            editText.type = 'text';
            editText.value = todo.todo;
            editText.classList.add('edit-text');
            const prioritySelectEdit = document.createElement('select');
            prioritySelectEdit.classList.add('edit-priority');
            const priorities = ['low', 'medium', 'high'];
            for (const priority of priorities) {
                const option = document.createElement('option');
                option.value = priority;
                option.textContent = priority;
                prioritySelectEdit.appendChild(option);
            }
            prioritySelectEdit.value = todo.priority;

            const saveButton = document.createElement('button');
            saveButton.textContent = 'Guardar';
            saveButton.addEventListener('click', () => {
                editTodoAtIndex(index, editForm);
            });

            editForm.appendChild(editText);
            editForm.appendChild(prioritySelectEdit);
            editForm.appendChild(saveButton);

            listItem.removeChild(todoText);
            listItem.removeChild(editButton);
            listItem.appendChild(editForm);
            editText.focus();
        });

        deleteButton.classList.add('delete');
        deleteButton.innerHTML = "&times;";
        deleteButton.href = "#";
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteTodoAtIndex(index);
        });

        const priorityColor = getPriorityColor(todo.priority);
        listItem.style.backgroundColor = priorityColor || 'white';

        listItem.appendChild(todoCheckbox);
        listItem.appendChild(todoText);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        return listItem;
    };

    // Función para filtrar las tareas según la búsqueda y el tipo de filtro
    const searchTodos = () => {
        const keyword = searchInput.value.trim().toLowerCase();

        return todos.filter(todo => {
            const todoText = todo.todo.toLowerCase();
            const matchesKeyword = todoText.includes(keyword);

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

    // Función para actualizar la lista de tareas en el DOM
    const filterTodosAndRender = () => {
        todosContainer.innerHTML = '';
        const filteredTodos = searchTodos();

        for (const [index, todo] of filteredTodos.entries()) {
            const todoElement = createTodoElement(todo, index);
            todosContainer.appendChild(todoElement);
        }
    };

    // Event listener para la entrada de búsqueda
    searchInput.addEventListener('input', () => {
        searchKeyword = searchInput.value.trim().toLowerCase();
        filterTodosAndRender();
    });

    // Event listeners para los botones de filtro
    showAllButton.addEventListener('click', () => {
        filterType = 'all';
        filterTodosAndRender();
    });

    showCompletedButton.addEventListener('click', () => {
        filterType = 'completed';
        filterTodosAndRender();
    });

    showNotCompletedButton.addEventListener('click', () => {
        filterType = 'notCompleted';
        filterTodosAndRender();
    });

    // Función para obtener el color de prioridad
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low':
                return '#12A14B';
            case 'medium':
                return '#CD5200';
            case 'high':
                return '#CB3234';
            default:
                return 'white';
        }
    };

    // Inicializar la lista de tareas y cargar
    const initialize = () => {
        todos = getTodosFromLocalStorage();
        filterTodosAndRender();
    }

    initialize();
});