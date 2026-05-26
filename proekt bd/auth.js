// Функция для регистрации
async function registerUser(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            alert("Регистрация успешна!");
            window.location.href = 'login.html';
        } else {
            alert("Ошибка при регистрации");
        }
    } catch (err) {
        alert("Ошибка подключения к серверу");
    }
}

// Функция для входа
async function loginUser(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token); // Сохраняем токен!
            alert("Вход выполнен!");
            window.location.href = 'main.html';
        } else {
            alert(data.message || "Ошибка входа");
        }
    } catch (err) {
        alert("Ошибка подключения к серверу");
    }
}