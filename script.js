// --- Clock ---
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById("time").textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();

// --- Theme toggle ---
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') document.body.classList.add('dark');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// --- Weather ---
const weatherElement = document.getElementById("weather");
const apiKey = "b07f8be36b1a931201149704ce14589d"; // replace with your OpenWeatherMap key
const city = "Curitiba";

async function loadWeather() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`
        );
        if (!response.ok) throw new Error("Weather API error");

        const data = await response.json();
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;

        weatherElement.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather">
            <span>${city}: ${temp}°C, ${description}</span>
        `;
    } catch (error) {
        weatherElement.textContent = "Unable to load weather";
        console.error(error);
    }
}
loadWeather();

// --- Tasks ---
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("task-input");
const taskCategory = document.getElementById("task-category");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const category = taskCategory.value;
    if (!text) return;

    const newTask = { id: Date.now(), text, category, completed: false };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
});

function renderTasks(filter = "all") {
    taskList.innerHTML = "";
    const filtered = tasks.filter(task => {
        if (filter === "all") return true;
        if (filter === "completed") return task.completed;
        if (filter === "active") return !task.completed;
        return task.category === filter;
    });

    filtered.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task-item");
        if (task.completed) li.classList.add("done");

        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <span class="tag ${task.category}">${task.category}</span>
            <button class="complete-btn">✓</button>
            <button class="delete-btn">✕</button>
        `;

        li.querySelector(".complete-btn").addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks(filter);
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks(filter);
        });

        taskList.appendChild(li);
    });
}

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        renderTasks(filter);
    });
});

renderTasks();

li.querySelector(".delete-btn").addEventListener("click", () => {
    li.style.transition = "all 0.3s ease";
    li.style.opacity = 0;
    li.style.transform = "translateX(50px)";
    setTimeout(() => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks(filter);
    }, 300);
});


