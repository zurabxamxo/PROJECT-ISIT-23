const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = 'super_secret_key';

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'auto_parts_shop'
});

db.connect((err) => {
    if (err) console.error('Ошибка подключения к БД:', err);
    else console.log('Подключено к БД!');
});

// --- Маршрут регистрации ---
app.post('/api/register', async (req, res) => {
    // Убираем email из получения данных
    const { username, password } = req.body; 
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Убираем 'email' из списка полей и один символ '?' из списка значений
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        
        // Передаем только username и пароль
        db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "Этот логин уже занят!" });
                }
                console.error("ОШИБКА MYSQL:", err);
                return res.status(500).json({ message: "Ошибка базы данных" });
            }
            res.status(201).json({ message: "Пользователь успешно зарегистрирован!" });
        });
    } catch (e) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// --- Маршрут логина ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) return res.status(401).send({ message: "Пользователь не найден" });
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send({ message: "Неверный пароль" });
        
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).send({ token });
    });
});

// --- Маршрут получения товаров ---
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error("Ошибка при получении товаров:", err);
            return res.status(500).json({ error: "Ошибка БД" });
        }
        res.json(results);
    });
});

// --- Маршрут оформления заказа (checkout) ---
app.post('/api/checkout', (req, res) => {
    // Здесь будет логика сохранения заказа в таблицу orders
    console.log("Заказ получен:", req.body);
    res.status(200).json({ message: "Заказ оформлен!" });
});

// Запуск сервера
app.listen(3000, () => console.log('Сервер запущен на http://localhost:3000'));