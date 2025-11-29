const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.classList.add('fade-in');
  if (task.completed) li.classList.add('completed');
  li.setAttribute('data-id', task.id);

  // Checkbox
  const checkbox = document.createElement('div');
  checkbox.classList.add('checkbox');
  checkbox.setAttribute('role', 'checkbox');
  checkbox.setAttribute('tabindex', '0');
  checkbox.setAttribute('aria-checked', task.completed);
  checkbox.setAttribute('aria-label', 'Mark task as completed');
  li.appendChild(checkbox);

  // Task text (contenteditable)
  const taskText = document.createElement('div');
  taskText.classList.add('task-text');
  taskText.textContent = task.text;
  taskText.setAttribute('contenteditable', 'false');
  taskText.setAttribute('tabindex', '0');
  taskText.setAttribute('aria-label', 'Task description');
  li.appendChild(taskText);

  // Actions container
  const actions = document.createElement('div');
  actions.classList.add('actions');

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.classList.add('action-btn');
  editBtn.setAttribute('aria-label', 'Edit task');
  editBtn.innerHTML = '✏️';
  actions.appendChild(editBtn);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('action-btn');
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.innerHTML = '🗑️';
  actions.appendChild(deleteBtn);

  li.appendChild(actions);

  // Event listeners

  // Toggle complete on checkbox click or keyboard
  checkbox.addEventListener('click', () => toggleComplete(task.id, li, checkbox));
  checkbox.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleComplete(task.id, li, checkbox);
    }
  });

  // Edit task
  editBtn.addEventListener('click', () => {
    if (taskText.getAttribute('contenteditable') === 'false') {
      taskText.setAttribute('contenteditable', 'true');
      taskText.focus();
      editBtn.innerHTML = '💾'; // Save icon
    } else {
      taskText.setAttribute('contenteditable', 'false');
      editBtn.innerHTML = '✏️';
      updateTaskText(task.id, taskText.textContent.trim());
    }
  });

  // Save on blur or Enter key while editing
  taskText.addEventListener('blur', () => {
    if (taskText.getAttribute('contenteditable') === 'true') {
      taskText.setAttribute('contenteditable', 'false');
      editBtn.innerHTML = '✏️';
      updateTaskText(task.id, taskText.textContent.trim());
    }
  });

  taskText.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      taskText.blur();
    }
  });

  // Delete task
  deleteBtn.addEventListener('click', () => removeTask(task.id, li));

  return li;
}

function toggleComplete(id, li, checkbox) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  if (task.completed) {
    li.classList.add('completed');
    checkbox.setAttribute('aria-checked', 'true');
  } else {
    li.classList.remove('completed');
    checkbox.setAttribute('aria-checked', 'false');
  }
  saveTasks();
}

function updateTaskText(id, newText) {
  if (newText === '') return; // Don't allow empty tasks
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.text = newText;
  saveTasks();
}

function removeTask(id, li) {
  li.classList.add('fade-out');
  li.addEventListener('animationend', () => {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    li.remove();
  });
}

function addTask(text) {
  if (text.trim() === '') return;
  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  const taskElement = createTaskElement(newTask);
  list.appendChild(taskElement);
}

// Render all tasks on load
function renderTasks() {
  list.innerHTML = '';
  tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    list.appendChild(taskElement);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  addTask(input.value);
  input.value = '';
  input.focus();
});

// Initial render
renderTasks();
