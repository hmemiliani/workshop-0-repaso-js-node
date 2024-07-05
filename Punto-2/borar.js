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

function deleteNote(index) {
    const notes = loadNotes();
    notes.splice(index, 1);
    saveNotes(notes);
    renderNotes();
}

function toggleImportant(index) {
    const notes = loadNotes();
    notes[index].toggleImportance();
    saveNotes(notes);
    renderNotes();
}

function renderNotes() {
    const notes = loadNotes();
    const list = document.getElementById('notesList');
    list.innerHTML = '';
    notes.forEach((note, index) => {
        const li = document.createElement('li');
        li.textContent = note.texto;
        li.className = note.importante ? 'important' : '';
        li.addEventListener('click', () => toggleImportant(index));

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
        li.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteNote(index);
        };
        li.appendChild(deleteBtn);

        list.appendChild(li);
    });
}
