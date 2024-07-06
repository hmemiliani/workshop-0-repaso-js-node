class Task {
    // se define la clase Task
    constructor(id, name, description, completed = false) {
        // constructor de la clase Task que toma cuatro parametros
        this.id = id;  // se asigna el id a la propiedad id de la tarea
        this.name = name;  // se asigna el nombre a la propiedad name de la tarea
        this.description = description;  // se asigna la descripcion a la propiedad description de la tarea
        this.completed = completed;  // se asigna el estado completado a la propiedad completed de la tarea (por defecto es false)
    }

    // Metodo para alternar el estado completado de la tarea
    toggleComplete() {
        this.completed = !this.completed;  // este cambia el valor de completed al opuesto (true a false o viceversa)
    }
}

class TaskManager {
    // se define la clase TaskManager
    constructor() {
        // se define el constructor de la clase TaskManager
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];  // se obtiene las tareas almacenadas en localStorage o usa un array vacio
        this.loadTasks();  // Llamamos al metodo loadTasks para cargar las tareas en la interfaz
    }

    // Metodo para agregar una nueva tarea
    addTask(name, description) {
        const id = this.tasks.length ? this.tasks[this.tasks.length - 1].id + 1 : 1;  // se calcula el id de la nueva tarea
        const task = new Task(id, name, description);  // se crea una nueva instancia de Task
        this.tasks.push(task);  // Agregamos la nueva tarea al array tasks
        this.saveTasks();  // Llamamos al metodo saveTasks para guardar las tareas en localStorage
        this.renderTasks();  // Llamamos tambien al metodo renderTasks para actualizar la interfaz
    }

    // Metodo para eliminar una tarea
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);  // filtramos el array tasks para eliminar la tarea con el id proporcionado
        this.saveTasks();  // Llamamos al metodo saveTasks para guardar las tareas en localStorage
        this.renderTasks();  // Llamamos tambien al metodo renderTasks para actualizar la interfaz
    }

    // Metodo para alternar el estado completado de una tarea
    toggleTaskComplete(id) {
        const task = this.tasks.find(task => task.id === id);  // buscams la tarea con el id proporcionado
        if (task) {  // Si la tarea se encuentra
            task.toggleComplete();  // Llama al metodo toggleComplete de la tarea para cambiar su estado
            this.saveTasks();  // llama tambien al metodo saveTasks para guardar las tareas en localStorage
            this.renderTasks();  // Y llama al metodo renderTasks para actualizar la interfaz
        }
    }

    // Metodo para guardar las tareas en localStorage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));  // guardamos el array tasks en localStorage como una cadena JSON
    }

    // Metodo pra guardar la edicion de una descripcion de tarea
    saveTaskEdit(id, description) {
        const task = this.tasks.find(task => task.id === id);  // buscamos la tarea con el id
        if (task) {  // Si la tarea es encontrada...
            task.description = description.trim();  // actualizamos la descripcion de la tarea
            this.saveTasks();  // Llamamos al metodo saveTasks para guardar las tareas en localStorage
            this.renderTasks();  // y llama al metodo renderTasks para actualizar la interfaz
        }
    }    

    // Metodo para cargar las tareas en la interfaz
    loadTasks() {
        this.renderTasks();  // llamamos al metodo renderTasks para actualizar la interfaz
    }

    // Metodo para renderizar las tareas en la interfaz
    renderTasks() {
        const $taskList = document.getElementById('task-list');  // obtenemos el elemento con id task-list del DOM
        $taskList.innerHTML = '';  // limpiamos el contenido actual del elemento task-list
        this.tasks.forEach(task => {  // iteramos sobre cada tarea en el array tasks
            const $item = document.createElement('li');  // creamos un elemento li para cada tarea
    
            // Elemento para el nombre (no editable)
            const $taskName = document.createElement('span');  // creamos un elemento span para el nombre de la tarea
            $taskName.textContent = `${task.name}: `;  // establecemos el texto del span con el nombre de la tarea seguido de dos puntos
            $item.appendChild($taskName);  // agregamos el span del nombre al elemento li
    
            // Elemento para la descripcion (editable)
            const $taskDescription = document.createElement('span');  // Creamos un elemento span para la descripcion de la tarea
            $taskDescription.textContent = task.description;  // establecemos el texto del span con la descripcion de la tarea
            $taskDescription.contentEditable = "true";  // Hacemos que el span de la descripcion sea editable
            $taskDescription.onblur = () => this.saveTaskEdit(task.id, $taskDescription.textContent);  // agregamos un evento onblur(nuevo para mi) para guardar los cambios cuando el usuario deje de editar la descripcion
            $item.appendChild($taskDescription);  // agregamos el span de la descripcion al elemento li
    
            // Mostrar estado
            const $status = document.createElement('span');  // creamos un elemento span para mostrar el estado de la tarea
            $status.textContent = task.completed ? ' (Completado)' : ' (Pendiente)';  // establecemos el texto del span con el estado de la tarea
            $item.appendChild($status);  // agregamos el span de estado al elemento li
    
            // Boton para completar o desmarcar
            const toggleButton = document.createElement('button');  // creamos un boton para alternar el estado de la tarea
            toggleButton.textContent = task.completed ? 'Desmarcar' : 'Completar';  // ponemos el texto del boton dependiendo del estado de la tarea
            toggleButton.addEventListener('click', (e) => {  // agregamos un evento click al boton
                e.stopPropagation();  // evitamos que el evento se propague al padre
                this.toggleTaskComplete(task.id);  // llamamos al metodo toggleTaskComplete para alternar el estado de la tarea
                $status.textContent = task.completed ? ' (Pendiente)' : ' (Completado)';  // actualizamos el texto del estado
                toggleButton.textContent = task.completed ? 'Desmarcar' : 'Completar';  // actualizamos el texto del boton
            });
            $item.appendChild(toggleButton);  // agregamos el boton de alternar al elemento li
    
            // Boton de eliminar
            const $deleteButton = document.createElement('button');  // creamos un boton para eliminar la tarea
            $deleteButton.textContent = 'Eliminar';  // establecemos el texto del boton como 'Eliminar'
            $deleteButton.className = 'delete';  // agregamos una clase delrete al boton de eliminar
            $deleteButton.addEventListener('click', (e) => {  // agregamos un evento click al boton
                e.stopPropagation();  // evitamos que el evento se propague
                this.deleteTask(task.id);  // lamamos al metodo deleteTask para eliminar la tarea
            });
            $item.appendChild($deleteButton);  // agregamos el boton de eliminar al elemento li
    
            $taskList.appendChild($item);  // agregamos el elemento li al elemento task-list
        });
    }
}

// Evento que se ejecuta cuando el DOM ha cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();  // creamos una instancia de TaskManager

    // Agrega un evento click al boton de agregar tarea
    document.getElementById('add-task').addEventListener('click', () => {
        const $taskNameInput = document.getElementById('task-name');  // obtenemos el elemento de entrada para el nombre de la tarea
        const $taskDescriptionInput = document.getElementById('task-description');  // obtenemos el elemento de entrada para la descripcion de la tarea
        if ($taskNameInput.value.trim() !== '' && $taskDescriptionInput.value.trim() !== '') {  // Verificamos que los campos de nombre y descripcion no esten vacios
            taskManager.addTask($taskNameInput.value.trim(), $taskDescriptionInput.value.trim());  // Llamamos al metodo addTask para agregar la nueva tarea
            $taskNameInput.value = '';  // limpiamos el campo de entrada del nombre
            $taskDescriptionInput.value = '';  // limpiamos el campo de entrada de la descripcion
        }
    });
});
