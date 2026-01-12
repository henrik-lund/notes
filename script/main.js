const noteInput = document.querySelector('#noteInput');
const addBtn = document.querySelector('#addBtn');
const board = document.querySelector('#board');
const overlay = document.querySelector('#overlay');

let notes = [];
function loadNotes(){
    const saved = localStorage.getItem('notes');
    if (saved){
        notes = JSON.parse(saved);
        renderNotes();
    }
}

function saveNotes(){
    localStorage.setItem('notes', JSON.stringify(notes));
}

function addNote(){
    const text = noteInput.value.trim();
    
    
    if( text === ''){
        noteInput.classList.add('shake');
        setTimeout(() => noteInput.classList.remove('shake'), 300);
        return;
    };
    const note = {
        id: Date.now(),
        text: text
    }
    notes.push(note);
    saveNotes();
    renderNotes();
    noteInput.value = '';
    noteInput.focus();
}
function deleteNote(id){
    notes = notes.filter(note => note.id !== id);
    saveNotes()
    renderNotes()
}
function renderNotes(){
    board.innerHTML = '';
    
    if (notes.length === 0){
        return;
    }
    
    notes.forEach(note =>{
        const noteEl = document.createElement('div');
        noteEl.className = 'note';
        
        noteEl.innerHTML = `
        <button class="delete-btn">×</button>
        <button class="edit-btn">✎</button>
        <div class="note-text">${note.text}</div>
    `;
        
        const deleteBtn = noteEl.querySelector('.delete-btn');
        const editBtn = noteEl.querySelector('.edit-btn');
        const noteText = noteEl.querySelector('.note-text');
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNote(note.id);
        });
        
        
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            noteText.contentEditable = true;
            noteText.focus();
            
            const selection = window.getSelection();
            selection.removeAllRanges();
            const range = document.createRange();
            range.selectNodeContents(noteText);
            range.collapse(false);
            selection.addRange(range);
            
            
            const saveEdit = () => {
                noteText.contentEditable = false;
                const newText = noteText.textContent.trim();
                
                if(newText !== '' && newText !== note.text){
                    note.text = newText;
                    saveNotes();
                    renderNotes();
                } else if(newText === ''){
                    noteText.textContent = note.text;
                }
            };
            
            noteText.addEventListener('blur', saveEdit, { once: true });
            
            noteText.addEventListener('keydown', (e) => {
                if(e.key === 'Enter' && !e.shiftKey){
                    e.preventDefault();
                    noteText.blur();
                }
            }, { once: true });
        });
        
        
        noteEl.addEventListener('click', () => {
            noteEl.classList.toggle('zoomed');
            board.classList.toggle('blurred');
            overlay.classList.toggle('active');
        });
        
        board.appendChild(noteEl);
    });
}
overlay.addEventListener('click', () => {
    document.querySelector('.zoomed')?.classList.remove('zoomed');
    board.classList.remove('blurred');
    overlay.classList.remove('active');
});
addBtn.addEventListener('click', addNote);

noteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter'){
        addNote();
    }
});
loadNotes();