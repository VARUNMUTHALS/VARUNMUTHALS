document.addEventListener('DOMContentLoaded', () => {
    const app = new LifeLinkApp();
});

class LifeLinkApp {
    constructor() {
        this.user = null;
        this.tasks = [];
        this.healthInterval = null;
        this.waterGoalMet = false;
        
        // Cache DOM elements
        this.elements = {
            onboardingSection: document.getElementById('onboarding-section'),
            dashboardSection: document.getElementById('dashboard-section'),
            onboardingForm: document.getElementById('onboarding-form'),
            greeting: document.getElementById('greeting'),
            taskInput: document.getElementById('task-input'),
            addTaskBtn: document.getElementById('add-task-btn'),
            taskList: document.getElementById('task-list'),
            moodBtns: document.querySelectorAll('.mood-btn'),
            moodSuggestion: document.getElementById('mood-suggestion'),
            learningInput: document.getElementById('learning-input'),
            askAiBtn: document.getElementById('ask-ai-btn'),
            learningResponse: document.getElementById('learning-response'),
            healthToggle: document.getElementById('health-toggle'),
            healthStatus: document.getElementById('health-status'),
            drinkWaterBtn: document.getElementById('drink-water-btn'),
            sosBtn: document.getElementById('sos-btn')
        };

        this.init();
    }

    init() {
        this.loadUser();
        this.bindEvents();
        
        // Load existing tasks
        const savedTasks = localStorage.getItem('lifelink_tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            this.renderTasks();
        }
    }

    bindEvents() {
        if (this.elements.onboardingForm) {
            this.elements.onboardingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleOnboarding();
            });
        }

        if (this.elements.addTaskBtn) {
            this.elements.addTaskBtn.addEventListener('click', () => this.addTask());
        }
        
        if (this.elements.taskInput) {
            this.elements.taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addTask();
            });
        }

        if (this.elements.moodBtns) {
            this.elements.moodBtns.forEach(btn => {
                btn.addEventListener('click', () => this.handleMood(btn.dataset.mood));
            });
        }

        if (this.elements.askAiBtn) {
            this.elements.askAiBtn.addEventListener('click', () => this.handleLearningAI());
        }

        if (this.elements.healthToggle) {
            this.elements.healthToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.startHealthTimer();
                } else {
                    this.stopHealthTimer();
                }
            });
        }

        if (this.elements.drinkWaterBtn) {
            this.elements.drinkWaterBtn.addEventListener('click', () => {
                this.waterGoalMet = true;
                this.elements.healthStatus.textContent = "Goal Status: Met! Great job. 💧";
                this.elements.healthStatus.style.color = "green";
            });
        }

        if (this.elements.sosBtn) {
            this.elements.sosBtn.addEventListener('click', () => this.triggerSOS());
        }
    }

    // --- User Flow ---

    loadUser() {
        const userData = localStorage.getItem('lifelink_user');
        if (userData) {
            this.user = JSON.parse(userData);
            this.showDashboard();
        } else {
            this.showOnboarding();
        }
    }

    showOnboarding() {
        if (this.elements.onboardingSection) this.elements.onboardingSection.classList.remove('hidden');
        if (this.elements.dashboardSection) this.elements.dashboardSection.classList.add('hidden');
    }

    showDashboard() {
        if (this.elements.onboardingSection) this.elements.onboardingSection.classList.add('hidden');
        if (this.elements.dashboardSection) this.elements.dashboardSection.classList.remove('hidden');
        if (this.elements.greeting) this.elements.greeting.textContent = `Hello, ${this.user.name}!`;
    }

    handleOnboarding() {
        const nameInput = document.getElementById('user-name');
        const ageInput = document.getElementById('user-age');
        
        if (!nameInput || !ageInput) return;

        const name = nameInput.value;
        const age = ageInput.value;
        const goals = Array.from(document.querySelectorAll('input[name="goal"]:checked')).map(cb => cb.value);

        this.user = {
            id: crypto.randomUUID(),
            name,
            age,
            goals,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('lifelink_user', JSON.stringify(this.user));
        this.showDashboard();
    }

    // --- Task Logic (AI Simulated) ---

    addTask() {
        if (!this.elements.taskInput) return;
        const text = this.elements.taskInput.value.trim();
        if (!text) return;

        // Mock AI Analysis
        const analysis = this.analyzeTaskWithAI(text);

        const task = {
            id: crypto.randomUUID(),
            text,
            priority: analysis.priority,
            timeSlot: analysis.timeSlot,
            status: 'pending'
        };

        this.tasks.unshift(task); // Add to top
        this.saveTasks();
        this.renderTasks();
        this.elements.taskInput.value = '';
    }

    analyzeTaskWithAI(text) {
        const lowerText = text.toLowerCase();

        let priority = 'Medium';
        if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('emergency') || lowerText.includes('immediately')) {
            priority = 'High';
        } else if (lowerText.includes('later') || lowerText.includes('whenever') || lowerText.includes('low')) {
            priority = 'Low';
        }

        let timeSlot = 'Afternoon';
        if (lowerText.includes('morning') || lowerText.includes('breakfast') || lowerText.includes('am')) {
            timeSlot = 'Morning';
        } else if (lowerText.includes('evening') || lowerText.includes('dinner') || lowerText.includes('pm') || lowerText.includes('night')) {
            timeSlot = 'Evening';
        }

        return { priority, timeSlot };
    }

    saveTasks() {
        localStorage.setItem('lifelink_tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        if (!this.elements.taskList) return;
        this.elements.taskList.innerHTML = '';
        this.tasks.forEach(task => {
            const div = document.createElement('div');
            div.className = 'task-item';
            div.innerHTML = `
                <div class="task-text">${task.text}</div>
                <div class="task-meta">
                    <span class="badge badge-${task.priority.toLowerCase()}">${task.priority}</span>
                    <span class="badge badge-time">${task.timeSlot}</span>
                </div>
            `;
            this.elements.taskList.appendChild(div);
        });
    }

    // --- Mood Logic (AI Simulated) ---

    handleMood(mood) {
        let suggestion = "";

        // AI Logic Simulation
        switch(mood) {
            case 'Happy':
                suggestion = "That's wonderful! Consider sharing your positive energy with a friend or journaling about this moment.";
                break;
            case 'Neutral':
                suggestion = "A steady day is a good day. Maybe try a 5-minute stretch to boost your energy.";
                break;
            case 'Sad':
                suggestion = "It's okay to feel this way. How about a short walk outside or listening to your favorite comfort song?";
                break;
            case 'Angry':
                suggestion = "Take a deep breath. Count to ten. Try writing down what's frustrating you to get it out of your system.";
                break;
            case 'Tired':
                suggestion = "Rest is productive too. If you can, take a 20-minute power nap or drink a glass of water.";
                break;
            default:
                suggestion = "Take a moment for yourself.";
        }

        if (this.elements.moodSuggestion) {
            this.elements.moodSuggestion.textContent = `AI Suggestion: ${suggestion}`;
            this.elements.moodSuggestion.classList.remove('hidden');
        }
    }

    // --- Learning AI Logic (AI Simulated) ---

    handleLearningAI() {
        if (!this.elements.learningInput) return;
        const question = this.elements.learningInput.value.trim().toLowerCase();
        if (!question) return;

        let response = "";

        // Simple keyword matching Mock
        if (question.includes('sky') && question.includes('blue')) {
            response = "The sky appears blue because of 'Rayleigh scattering'. Sunlight reaches Earth's atmosphere and is scattered in all directions by gases and particles. Blue light is scattered more than other colors because it travels as shorter, smaller waves.";
        } else if (question.includes('water') && question.includes('wet')) {
            response = "Water feels wet because of the way our skin interacts with it. We don't actually have 'wetness' receptors! Instead, our brain combines signals from pressure and cold temperature sensors to create the sensation of wetness.";
        } else if (question.includes('love')) {
            response = "Love is a complex mix of emotions, behaviors, and beliefs associated with strong feelings of affection, protectiveness, warmth, and respect for another person. Biologically, it involves hormones like oxytocin and dopamine.";
        } else {
            response = "That's a fascinating question! As a prototype AI, I have limited knowledge, but in a real-world scenario, I would break this down into simple terms using analogies to help you understand.";
        }

        if (this.elements.learningResponse) {
            this.elements.learningResponse.textContent = response;
            this.elements.learningResponse.classList.remove('hidden');
        }
    }

    // --- Health Logic ---

    startHealthTimer() {
        if (this.elements.healthStatus) this.elements.healthStatus.textContent = "Monitoring hydration...";
        // Check every 10 seconds for demo purposes
        this.healthInterval = setInterval(() => {
            if (!this.waterGoalMet) {
                alert("Time to drink some water! Stay hydrated.");
            } else {
                // Reset for next interval logic if we were tracking hourly,
                // but for this simple demo, we'll keep it met until page reload or manual reset.
                // In a real app, we'd reset this flag every hour.
            }
        }, 10000);
    }

    stopHealthTimer() {
        clearInterval(this.healthInterval);
        if (this.elements.healthStatus) this.elements.healthStatus.textContent = "Reminders disabled.";
    }

    // --- SOS Logic ---

    triggerSOS() {
        // Mock Location
        const mockLat = "40.7128 N";
        const mockLng = "74.0060 W";

        const confirmed = confirm("Are you sure you want to send an emergency alert?");
        if (confirmed) {
            alert(`EMERGENCY ALERT SENT!\n\nLocation: ${mockLat}, ${mockLng}\nStatus: Contacts notified.`);
        }
    }
}
