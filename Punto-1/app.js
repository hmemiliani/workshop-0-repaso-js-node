class Task {
    constructor(id, name, description, completed = false) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.completed = completed;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }
}

class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.loadTasks();
    }

    addTask(name, description) {
        const id = this.tasks.length ? this.tasks[this.tasks.length - 1].id + 1 : 1;
        const task = new Task(id, name, description);
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTaskComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.toggleComplete();
            this.saveTasks();
            this.renderTasks();
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    saveTaskEdit(id, description) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.description = description.trim();
            this.saveTasks();
            this.renderTasks();
        }
    }    

    loadTasks() {
        this.renderTasks();
    }

    renderTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        this.tasks.forEach(task => {
            const item = document.createElement('li');
    
            // Elemento para el nombre (no editable)
            const taskName = document.createElement('span');
            taskName.textContent = `${task.name}: `;
            item.appendChild(taskName);
    
            // Elemento para la descripción editable
            const taskDescription = document.createElement('span');
            taskDescription.textContent = task.description;
            taskDescription.contentEditable = "true";
            taskDescription.onblur = () => this.saveTaskEdit(task.id, taskDescription.textContent);
            item.appendChild(taskDescription);
    
            // Mostrar estado
            const status = document.createElement('span');
            status.textContent = task.completed ? ' (Completado)' : ' (Pendiente)';
            item.appendChild(status);
    
            // Botón para completar o desmarcar
            const toggleButton = document.createElement('button');
            toggleButton.textContent = task.completed ? 'Desmarcar' : 'Completar';
            toggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleTaskComplete(task.id);
                status.textContent = task.completed ? ' (Pendiente)' : ' (Completado)';
                toggleButton.textContent = task.completed ? 'Desmarcar' : 'Completar';
            });
            item.appendChild(toggleButton);
    
            // Botón de eliminar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = 'delete';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(task.id);
            });
            item.appendChild(deleteButton);
    
            taskList.appendChild(item);
        });
    }
    
    
}

document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();

    document.getElementById('add-task').addEventListener('click', () => {
        const taskNameInput = document.getElementById('task-name');
        const taskDescriptionInput = document.getElementById('task-description');
        if (taskNameInput.value.trim() !== '' && taskDescriptionInput.value.trim() !== '') {
            taskManager.addTask(taskNameInput.value.trim(), taskDescriptionInput.value.trim());
            taskNameInput.value = '';
            taskDescriptionInput.value = '';
        }
    });
    
});