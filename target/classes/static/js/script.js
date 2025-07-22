document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('task-list');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');

    const apiBaseUrl = '/api/tasks';

    const fetchTasks = async () => {
        try {
            const response = await fetch(apiBaseUrl);
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const renderTasks = (tasks) => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            if (task.completed) {
                listItem.classList.add('completed');
            }

            const taskText = document.createElement('span');
            taskText.textContent = task.description;
            listItem.appendChild(taskText);

            const buttonWrapper = document.createElement('div');

            const completeBtn = document.createElement('button');
            completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
            completeBtn.className = task.completed ? 'undo-btn' : 'complete-btn';
            completeBtn.onclick = () => updateTaskStatus(task);
            buttonWrapper.appendChild(completeBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => deleteTask(task.id);
            buttonWrapper.appendChild(deleteBtn);

            listItem.appendChild(buttonWrapper);
            taskList.appendChild(listItem);
        });
    };

    const addTask = async () => {
        const description = taskInput.value.trim();
        if (!description) {
            alert('Task description cannot be empty!');
            return;
        }

        const newTask = { description, completed: false };

        try {
            await fetch(apiBaseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask),
            });
            taskInput.value = '';
            fetchTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const updateTaskStatus = async (task) => {
        try {
            await fetch(`${apiBaseUrl}/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...task, completed: !task.completed }),
            });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await fetch(`${apiBaseUrl}/${id}`, { method: 'DELETE' });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    fetchTasks();
});