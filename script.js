// Basic script setup
console.log("script.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput'); // Added
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Function to create a new task list item
    function createTaskElement(task) { // task is an object: { text: String, completed: Boolean, dueDate: String, priority: String }
        const listItem = document.createElement('li');
        listItem.dataset.task = JSON.stringify(task); 
        
        // Add priority class
        if (task.priority) {
            listItem.classList.add(`priority-${task.priority.toLowerCase()}`);
        } else {
            listItem.classList.add('priority-medium'); // Default if somehow not set
        }

        const taskInfoDiv = document.createElement('div'); // Create task-info div
        taskInfoDiv.className = 'task-info';

        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = task.text;
        taskInfoDiv.appendChild(taskTextSpan); // Append text to task-info

        if (task.dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.className = 'due-date';
            try {
                const date = new Date(task.dueDate + 'T00:00:00'); 
                dueDateSpan.textContent = `Due: ${date.toLocaleDateString()}`;
                const today = new Date();
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dueDateObj = new Date(task.dueDate + 'T00:00:00'); // Ensure this is just date part for comparison
                dueDateObj.setHours(0,0,0,0);


                if (dueDateObj < today) {
                    listItem.classList.add('overdue');
                } else {
                    const diffTime = Math.abs(dueDateObj - today);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays <= 3) {
                        listItem.classList.add('due-soon');
                    }
                }
            } catch (e) {
                console.error("Error parsing date: ", task.dueDate, e);
                dueDateSpan.textContent = "Due: Invalid Date";
            }
            taskInfoDiv.appendChild(dueDateSpan); // Append due date to task-info
        }
        
        listItem.appendChild(taskInfoDiv); // Append task-info to listItem


        if (task.completed) {
            listItem.classList.add('completed');
        }

        // Event listener to toggle task completion (on the text span/task-info click)
        // Let's make taskInfoDiv clickable for completion toggle
        taskTextSpan.addEventListener('click', () => {
            if (!listItem.classList.contains('editing')) {
                listItem.classList.toggle('completed');
                // Update dataset before saving
                const currentTask = JSON.parse(listItem.dataset.task);
                currentTask.completed = listItem.classList.contains('completed');
                listItem.dataset.task = JSON.stringify(currentTask);
                saveTasks();
                filterTasks();
            }
        });
        
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'task-controls';

        // Add Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleEditMode(listItem, taskTextSpan, editBtn);
        });
        controlsDiv.appendChild(editBtn);

        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            deleteTask(listItem);
        });
        controlsDiv.appendChild(deleteBtn);
        listItem.appendChild(controlsDiv);

        return listItem;
    }

    taskInfoDiv.addEventListener('click', (e) => { // Changed from taskTextSpan to taskInfoDiv
        // Prevent toggle if clicking on an interactive element within taskInfo (if any added later)
        if (e.target !== taskInfoDiv && e.target !== taskTextSpan && e.target !== listItem.querySelector('.due-date')) {
             // This check might need refinement if more elements are added in taskInfoDiv
            return;
        }
        if (!listItem.classList.contains('editing')) {
            listItem.classList.toggle('completed');
            const currentTask = JSON.parse(listItem.dataset.task);
            currentTask.completed = listItem.classList.contains('completed');
            listItem.dataset.task = JSON.stringify(currentTask);
            saveTasks();
            filterTasks();
        }
    });
        
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'task-controls';

    // Add Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Pass taskInfoDiv instead of taskTextSpan if edit needs to replace whole info area
        toggleEditMode(listItem, taskTextSpan, editBtn); 
    });
    controlsDiv.appendChild(editBtn);

    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        deleteTask(listItem);
    });
    controlsDiv.appendChild(deleteBtn);
    listItem.appendChild(controlsDiv);

    return listItem;
}


// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const dueDateValue = dueDateInput.value;
    const priorityValue = priorityInput.value; // Get priority

    if (taskText === "") return;

    const task = {
        text: taskText,
        completed: false,
        dueDate: dueDateValue || null,
        priority: priorityValue || 'Medium' // Default priority
    };
    const listItem = createTaskElement(task);
        listItem.classList.add('new-task-animation');
        // Optional: Remove class after animation completes to allow re-triggering if needed
        // listItem.addEventListener('animationend', () => {
        //     listItem.classList.remove('new-task-animation');
        // });

        taskList.appendChild(listItem);
        taskInput.value = ""; 
        dueDateInput.value = ""; 
        priorityInput.value = 'Medium'; // Reset priority input
        saveTasks();
    }
    
    // Function to toggle edit mode - taskTextSpan is passed for now.
    // If edit needs to replace entire taskInfoDiv, this function signature and logic would change.
    function toggleEditMode(listItem, taskTextSpan, editBtn) {
        const isEditing = listItem.classList.toggle('editing');
        const taskInfoDiv = listItem.querySelector('.task-info'); // Get the taskInfoDiv

        if (isEditing) {
            const currentText = taskTextSpan.textContent;
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.className = 'edit-task-input';
            inputField.value = currentText;
            
            // Replace taskTextSpan with inputField within taskInfoDiv
            taskInfoDiv.insertBefore(inputField, taskTextSpan);
            taskInfoDiv.removeChild(taskTextSpan);
            inputField.focus();
            
            editBtn.textContent = 'Save';
            editBtn.classList.add('save-btn'); 
            editBtn.classList.remove('edit-btn');

            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveEdit(listItem, inputField, editBtn, taskInfoDiv); // Pass taskInfoDiv
                }
            });
            inputField.addEventListener('blur', () => {
                setTimeout(() => {
                  if (listItem.classList.contains('editing')) {
                    saveEdit(listItem, inputField, editBtn, taskInfoDiv); // Pass taskInfoDiv
                  }
                }, 100);
            });

        } else { 
            // This case handled by saveEdit
        }
    }

    function saveEdit(listItem, inputField, editBtn, taskInfoDiv) { // Added taskInfoDiv
        if (!listItem.classList.contains('editing')) return;

        const newText = inputField.value.trim();
        
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = newText;

        // Replace inputField with taskTextSpan within taskInfoDiv
        taskInfoDiv.insertBefore(taskTextSpan, inputField);
        taskInfoDiv.removeChild(inputField);

        const currentTask = JSON.parse(listItem.dataset.task);
        currentTask.text = newText; 
        listItem.dataset.task = JSON.stringify(currentTask);

        // Re-attach click listener to taskInfoDiv (already exists, but span is new)
        // The main click listener on taskInfoDiv should still work.
        
        editBtn.textContent = 'Edit';
        editBtn.classList.remove('save-btn');
        editBtn.classList.add('edit-btn');
        listItem.classList.remove('editing');
        
        saveTasks();
        filterTasks(); 
    }


    // Function to save tasks to local storage
    function deleteTask(listItem) {
        listItem.classList.add('fade-out'); // Add class for fade-out animation
        // Remove the item from DOM after the animation
        setTimeout(() => {
            taskList.removeChild(listItem);
            saveTasks(); // Save after removal
            // No need to filterTasks() here as the item is gone
        }, 300); // Corresponds to --transition-speed in CSS
    }

    // Function to toggle edit mode
    function toggleEditMode(listItem, taskTextSpan, editBtn) {
        const isEditing = listItem.classList.toggle('editing');
        if (isEditing) {
            const currentText = taskTextSpan.textContent;
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.className = 'edit-task-input';
            inputField.value = currentText;
            
            // Replace span with input
            listItem.insertBefore(inputField, taskTextSpan);
            listItem.removeChild(taskTextSpan);
            inputField.focus();
            
            editBtn.textContent = 'Save';
            editBtn.classList.add('save-btn'); // For specific styling if needed
            editBtn.classList.remove('edit-btn');


            // Save on Enter or blur
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveEdit(listItem, inputField, editBtn);
                }
            });
            inputField.addEventListener('blur', () => {
                // Delay to allow save button click to register
                setTimeout(() => {
                  // Check if still in editing mode (button click might have saved it)
                  if (listItem.classList.contains('editing')) {
                    saveEdit(listItem, inputField, editBtn);
                  }
                }, 100);
            });

        } else { // Was saving, now revert to display
            // This case is handled by saveEdit
        }
    }

    function saveEdit(listItem, inputField, editBtn) {
        if (!listItem.classList.contains('editing')) return;

        const newText = inputField.value.trim();
        // const originalTask = JSON.parse(listItem.dataset.task); // Keep this if you need original values
        
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        // Use placeholder from original task text if newText is empty
        // taskTextSpan.textContent = newText === "" ? originalTask.text : newText; 
        // For now, if newText is empty, it will save an empty string as per current behavior.
        taskTextSpan.textContent = newText;


        // Replace input with span
        listItem.insertBefore(taskTextSpan, inputField);
        listItem.removeChild(inputField);

        // Update dataset task with new text
        const currentTask = JSON.parse(listItem.dataset.task);
        currentTask.text = newText; // Update text
        listItem.dataset.task = JSON.stringify(currentTask);


        // Re-attach click listener to the new span
        taskTextSpan.addEventListener('click', () => {
            if (!listItem.classList.contains('editing')) {
                // Update completion status in dataset before saving
                const taskData = JSON.parse(listItem.dataset.task);
                taskData.completed = listItem.classList.toggle('completed'); // toggle and get new state
                listItem.dataset.task = JSON.stringify(taskData);
                saveTasks();
                filterTasks();
            }
        });
        
        editBtn.textContent = 'Edit';
        editBtn.classList.remove('save-btn');
        editBtn.classList.add('edit-btn');
        listItem.classList.remove('editing');
        
        // Validation for empty newText can be added here if desired
        // e.g., if (newText === "") { deleteTask(listItem); return; }
        
        saveTasks();
        filterTasks(); // Re-apply filter after text change
    }


    // Function to save tasks to local storage
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(listItem => {
            if (!listItem.classList.contains('fade-out') && listItem.dataset.task) {
                try {
                    const taskData = JSON.parse(listItem.dataset.task);
                    // Ensure DOM state (text, completion) is reflected in what's saved,
                    // especially if edit/complete logic doesn't perfectly update dataset (it should now).
                    const textSpan = listItem.querySelector('span.task-text');
                    if (textSpan) taskData.text = textSpan.textContent; // Ensure text is current
                    taskData.completed = listItem.classList.contains('completed'); // Ensure completion is current
                    
                    tasks.push(taskData);
                } catch (e) {
                    console.error('Failed to parse task data from dataset during save:', listItem.dataset.task, e);
                }
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    

    // Function to load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                const listItem = createTaskElement(task);
                taskList.appendChild(listItem);
            });
        }
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    let currentFilter = 'all'; // Default filter

    const filterAllBtn = document.getElementById('filterAll');
    const filterActiveBtn = document.getElementById('filterActive');
    const filterCompletedBtn = document.getElementById('filterCompleted');

    function updateFilterButtons(activeFilter) {
        filterAllBtn.classList.toggle('active', activeFilter === 'all');
        filterActiveBtn.classList.toggle('active', activeFilter === 'active');
        filterCompletedBtn.classList.toggle('active', activeFilter === 'completed');
    }

    function filterTasks(filterType = currentFilter) {
        currentFilter = filterType;
        updateFilterButtons(currentFilter);
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(taskItem => {
            // Ensure item isn't mid-deletion animation before trying to style
            if (taskItem.classList.contains('fade-out')) {
                return; 
            }

            const isCompleted = taskItem.classList.contains('completed');
            switch (currentFilter) {
                case 'all':
                    taskItem.style.display = 'flex';
                    break;
                case 'active':
                    taskItem.style.display = isCompleted ? 'none' : 'flex';
                    break;
                case 'completed':
                    taskItem.style.display = isCompleted ? 'flex' : 'none';
                    break;
            }
        });
    }

    if (filterAllBtn && filterActiveBtn && filterCompletedBtn) {
        filterAllBtn.addEventListener('click', () => filterTasks('all'));
        filterActiveBtn.addEventListener('click', () => filterTasks('active'));
        filterCompletedBtn.addEventListener('click', () => filterTasks('completed'));
    } else {
        console.error("Filter buttons not found. Ensure their IDs are correct in index.html.");
    }
    
    const originalAddTaskRef = addTask; 
    addTask = () => { 
        originalAddTaskRef(); 
        filterTasks(); 
    };

    const originalAddTaskRef = addTask; 
    addTask = () => { 
        originalAddTaskRef(); 
        filterTasks(); 
    };

    // Sorting functionality
    const sortByDueDateBtn = document.getElementById('sortByDueDateBtn');
    const sortByPriorityBtn = document.getElementById('sortByPriorityBtn');
    const clearSortBtn = document.getElementById('clearSortBtn');
    let currentSortCriteria = 'default'; // To track active sort

    function updateSortButtons(activeCriteria) {
        if(sortByDueDateBtn) sortByDueDateBtn.classList.toggle('active', activeCriteria === 'dueDate');
        if(sortByPriorityBtn) sortByPriorityBtn.classList.toggle('active', activeCriteria === 'priority');
        if(clearSortBtn) clearSortBtn.classList.toggle('active', activeCriteria === 'default');
    }

    function sortTasks(criteria) {
        currentSortCriteria = criteria; // Update current sort criteria
        const items = Array.from(taskList.children);

        if (criteria === 'default') {
            // Easiest way to revert to "load order" is to reload from localStorage
            taskList.innerHTML = ''; // Clear current list
            loadTasks(); // This will load and create elements in localStorage order
            filterTasks(); // Re-apply current filter
            updateSortButtons('default');
            return;
        }

        const priorityMap = { 'High': 1, 'Medium': 2, 'Low': 3 };

        items.sort((a, b) => {
            const taskA = JSON.parse(a.dataset.task);
            const taskB = JSON.parse(b.dataset.task);

            if (criteria === 'dueDate') {
                const dateA = taskA.dueDate ? new Date(taskA.dueDate + 'T00:00:00') : null;
                const dateB = taskB.dueDate ? new Date(taskB.dueDate + 'T00:00:00') : null;

                if (!dateA && !dateB) return 0; // Both null, equal
                if (!dateA) return 1;  // Null dates go to bottom
                if (!dateB) return -1; // Null dates go to bottom
                return dateA - dateB; // Ascending
            } else if (criteria === 'priority') {
                const priorityA = priorityMap[taskA.priority || 'Medium'];
                const priorityB = priorityMap[taskB.priority || 'Medium'];
                return priorityA - priorityB; // Ascending by map value (High first)
            }
            return 0; // Should not happen if criteria is valid
        });

        // Re-append sorted items
        items.forEach(item => taskList.appendChild(item));
        
        updateSortButtons(criteria);
        // Note: filterTasks() might need to be called here if sorting should interact with filtering
        // For now, sorting re-orders all items, filter state is preserved visually but not re-applied to order.
        // Calling filterTasks() will ensure only filtered items are displayed, in their new sorted order.
        filterTasks(); 
    }

    if (sortByDueDateBtn) sortByDueDateBtn.addEventListener('click', () => sortTasks('dueDate'));
    if (sortByPriorityBtn) sortByPriorityBtn.addEventListener('click', () => sortTasks('priority'));
    if (clearSortBtn) clearSortBtn.addEventListener('click', () => sortTasks('default'));


    loadTasks(); 
    filterTasks(); 
    updateSortButtons('default'); // Initialize sort buttons state
});
