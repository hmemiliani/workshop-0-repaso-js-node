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

    loadTasks() {
        this.renderTasks();
    }

    renderTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        this.tasks.forEach(task => {
            const item = document.createElement('li');
            const taskContent = document.createElement('div');
            taskContent.textContent = `${task.name}: ${task.description}`;
            item.appendChild(taskContent);
    
            const status = document.createElement('span');
            status.textContent = task.completed ? 'Completado' : 'Pendiente';
            item.appendChild(status);
    
            if (!task.completed) {
                const completeButton = document.createElement('button');
                completeButton.textContent = 'Completar';
                completeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleTaskComplete(task.id);
                    completeButton.style.display = 'none'; // Ocultar el botón al completar la tarea
                    status.textContent = 'Completado';
                });
                item.appendChild(completeButton);
            }
    
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