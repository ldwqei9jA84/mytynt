// Функция для обновления количества монет в localStorage
function updateCoins(amount) {
    let coins = localStorage.getItem('coins');
    if (!coins) {
        coins = 0;
    }
    coins = parseInt(coins) + amount;
    localStorage.setItem('coins', coins);
    document.getElementById('coinCount').innerText = 'Баланс: ' + coinAmount;

}

// Функция для установки состояния выполнения задания
function setTaskCompleted(taskElement) {
    taskElement.classList.add('completed');
    const taskButton = taskElement.querySelector('.task-button');
    taskButton.innerText = 'Claimed';
    taskButton.removeAttribute('onclick');
}

// Функция для выполнения задания
function executeTask(taskUrl, taskElement) {
    window.open(taskUrl, '_blank'); // Открыть ссылку в новой вкладке
    // Изменяем кнопку на 'Собрать' сразу
    const taskButton = taskElement.querySelector('.task-button');
    taskButton.innerText = 'Собрать';
    taskButton.onclick = function() {
        collectTaskReward(taskElement);
    };
    taskButton.removeAttribute('disabled');
    saveTasksState(); // Сохраняем состояние задач
}

// Функция для сбора награды за задание
function collectTaskReward(taskElement) {
    updateCoins(30); // Добавляем 30 монет
    setTaskCompleted(taskElement); // Отмечаем задание как выполненное
    saveTasksState(); // Сохраняем состояние задач
}

// Функция для сохранения состояния задач
function saveTasksState() {
    const tasks = document.querySelectorAll('.task-item');
    const taskStates = [];
    tasks.forEach(task => {
        const isCompleted = task.classList.contains('completed');
        const buttonState = task.querySelector('.task-button').innerText;
        taskStates.push({ isCompleted, buttonState });
    });
    localStorage.setItem('taskStates', JSON.stringify(taskStates));
}

// Функция для загрузки состояния задач
function loadTasksState() {
    const taskStates = JSON.parse(localStorage.getItem('taskStates'));
    if (taskStates) {
        const tasks = document.querySelectorAll('.task-item');
        tasks.forEach((task, index) => {
            if (taskStates[index]) {
                const { isCompleted, buttonState } = taskStates[index];
                if (isCompleted) {
                    setTaskCompleted(task);
                }
                if (buttonState === 'Claim') {
                    const taskButton = task.querySelector('.task-button');
                    taskButton.innerText = 'Claim';
                    taskButton.onclick = function() {
                        collectTaskReward(task);
                    };
                    taskButton.removeAttribute('disabled');
                }
            }
        });
    }
}

// Функция для загрузки количества монет
function loadCoins() {
    let coins = localStorage.getItem('coins');
    if (!coins) {
        coins = 0;
    }
    document.getElementById('coinCount').innerText = `Coins: ${coins}`;
}

function showTaskPage() {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('taskPage').style.display = 'block';
    loadTasksState(); // Загружаем состояние задач при переключении на страницу заданий
}

function showMainPage() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('taskPage').style.display = 'none';
}


// Функция для начала фарминга
function startFarming() {
    const countdown = document.getElementById('countdown');
    countdown.style.display = 'block';
    let time = 10;
    countdown.innerText = `Remained: ${time} секунд`;

    const timer = setInterval(() => {
        time--;
        countdown.innerText = `Remained: ${time} секунд`;
        if (time <= 0) {
            clearInterval(timer);
            countdown.style.display = 'none';
            const farmButton = document.getElementById('farmButton');
            farmButton.innerText = 'Собрать';
            farmButton.onclick = function() {
                collectFarmingReward();
            };
            farmButton.removeAttribute('disabled');
        }
    }, 1000);
}
// Функция для переключения на главную страницу
function showMainPage() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('taskPage').style.display = 'none';
    document.getElementById('farmButton').style.position = 'absolute'; // Убедитесь, что кнопка фарминга остается на месте
    document.getElementById('farmButton').style.bottom = '20px';
    document.getElementById('farmButton').style.left = '50%';
    document.getElementById('farmButton').style.transform = 'translateX(-50%)';
}

// Функция для переключения на страницу заданий
function showTaskPage() {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('taskPage').style.display = 'block';
    loadTasksState(); // Загружаем состояние задач при переключении на страницу заданий
}

// Функция для начала фарминга
function startFarming() {
    const farmButton = document.getElementById('farmButton');
    let time = parseInt(localStorage.getItem('remainingTime'), 10);

    if (!time || time <= 0) {
        // Если времени нет или оно закончилось, устанавливаем 3 часа
        time = 3 * 3600; // 3 часа в секундах
    }

    const updateTimerDisplay = () => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        farmButton.innerText = `Remained: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    updateTimerDisplay();
    farmButton.setAttribute('disabled', 'true'); // Деактивируем кнопку во время отсчета

    const timer = setInterval(() => {
        time -= 1; // Уменьшаем время на 1 секунду
        localStorage.setItem('remainingTime', time); // Сохраняем оставшееся время в localStorage

        if (time <= 0) {
            clearInterval(timer);
            farmButton.innerText = 'Claim';
            farmButton.removeAttribute('disabled');
            farmButton.onclick = function() {
                collectFarmingReward();
                localStorage.removeItem('remainingTime'); // Удаляем сохраненное время после сбора
            };
        } else {
            updateTimerDisplay();
        }
    }, 1000); // Таймер обновляется каждую секунду
}

// Функция для сбора награды за фарминг
function collectFarmingReward() {
    updateCoins(30); // Добавляем 30 монет
    const farmButton = document.getElementById('farmButton');
    farmButton.innerText = 'Farm';
    farmButton.setAttribute('disabled', 'true');
}

// Проверка и запуск таймера при загрузке страницы
window.addEventListener('load', () => {
    const savedTime = localStorage.getItem('remainingTime');
    if (savedTime && parseInt(savedTime, 10) > 0) {
        startFarming(); // Продолжаем отсчет, если есть сохраненное время
    } else {
        const farmButton = document.getElementById('farmButton');
        farmButton.addEventListener('click', startFarming);
    }
});


// Проверка и запуск таймера при загрузке страницы
window.addEventListener('load', () => {
    const savedTime = localStorage.getItem('remainingTime');
    if (savedTime) {
        startFarming(); // Продолжаем отсчет, если есть сохраненное время
    } else {
        document.getElementById('farmButton').addEventListener('click', startFarming);
    }
});


// Функция для сбора награды за фарминг
function collectFarmingReward() {
    updateCoins(30); // Добавляем 30 монет
    const farmButton = document.getElementById('farmButton');
    farmButton.innerText = 'Farm';
    farmButton.setAttribute('disabled', 'true');
}

document.addEventListener('DOMContentLoaded', () => {
    loadCoins(); // Загружаем количество монет при загрузке страницы
    loadTasksState(); // Загружаем состояние задач при загрузке страницы
});
