// Get elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage when page loads
window.addEventListener('DOMContentLoaded', loadTasks);

// Add task function
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    // Add to localStorage
    saveTasks(task);
    
    // Create list item
    createTaskElement(task);
    
    taskInput.value = '';
    taskInput.focus();
}

// Create task element in DOM (FIXED: Using textContent instead of innerHTML for security)
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.dataset.id = task.id;
    
    // Create span for task text
    const span = document.createElement('span');
    span.style.cursor = 'pointer';
    span.style.flex = '1';
    span.textContent = task.text;
    span.addEventListener('click', () => toggleComplete(task.id));
    span.setAttribute('role', 'button');
    span.setAttribute('tabindex', '0');
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Toggle task completion
function toggleComplete(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        const li = document.querySelector(`[data-id="${id}"]`);
        li.classList.toggle('completed');
    }
}

// Delete task function
function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    const li = document.querySelector(`[data-id="${id}"]`);
    li.remove();
}

// Save task to localStorage
function saveTasks(newTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => createTaskElement(task));
}

// Clear all tasks
function clearAllTasks() {
    if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
        localStorage.setItem('tasks', JSON.stringify([]));
        taskList.innerHTML = '';
    }
}

// Add event listeners
addBtn.addEventListener('click', addTask);
clearBtn.addEventListener('click', clearAllTasks);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
