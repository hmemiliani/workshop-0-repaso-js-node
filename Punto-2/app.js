class Nota {
    constructor(texto, importante = false) {
        this.texto = texto;
        this.importante = importante;
    }

    toggleImportance() {
        this.importante = !this.importante;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderNotes();
});

function loadNotes() {
    const notesData = JSON.parse(localStorage.getItem('notes')) || [];
    return notesData.map(note => new Nota(note.texto, note.importante));
}

function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes.map(note => ({
        texto: note.texto,
        importante: note.importante
    }))));
}

function addNote() {
    const input = document.getElementById('noteInput');
    const notes = loadNotes();
    notes.push(new Nota(input.value));
    saveNotes(notes);
    input.value = '';
    renderNotes();
}

function deleteNote(noteToDelete) {
    let notes = loadNotes();
    notes = notes.filter(note => !(note.texto === noteToDelete.texto && note.importante === noteToDelete.importante));
    saveNotes(notes);
    renderNotes();
}

function toggleImportant(noteToToggle) {
    const notes = loadNotes();
    const note = notes.find(n => n.texto === noteToToggle.texto && n.importante === noteToToggle.importante);
    if (note) {
        note.toggleImportance();
        saveNotes(notes);
        renderNotes();
    }
}

function renderNotes() {
    const notes = loadNotes();
    const list = document.getElementById('notesList');
    list.innerHTML = '';

    notes.sort((a, b) => b.importante - a.importante);

    notes.forEach((note) => {
        const li = document.createElement('li');
        li.className = note.importante ? 'important' : '';

        const p = document.createElement('p');
        p.textContent = note.texto;
        li.appendChild(p);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'noteButtons';

        const importantBtn = document.createElement('button');
        importantBtn.textContent = note.importante ? 'No es importante' : 'Importante';
        importantBtn.onclick = (e) => {
            e.stopPropagation();
            toggleImportant(note);
        };

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            const newText = prompt('Edita tu nota:', note.texto);
            if (newText) {
                note.texto = newText;
                saveNotes(notes);
                renderNotes();
            }
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteNote(note);
        };

        buttonsDiv.appendChild(importantBtn);
        buttonsDiv.appendChild(editBtn);
        buttonsDiv.appendChild(deleteBtn);

        li.appendChild(buttonsDiv);

        list.appendChild(li);
    });
}
