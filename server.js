const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const usersPath = path.join(__dirname, 'users.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secreto_miluna',
  resave: false,
  saveUninitialized: true
}));

// Rutas para servir HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// POST - Registro de usuarios
app.post('/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send('<h2>Las contraseñas no coinciden. <a href="/register">Volver</a></h2>');
  }

  let users = [];
  if (fs.existsSync(usersPath)) {
    users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  }

  if (users.find(u => u.email === email)) {
    return res.send('<h2>El usuario ya existe. <a href="/register">Volver</a></h2>');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  res.send('<h2>Registro exitoso. <a href="/">Inicia sesión</a></h2>');
});

// POST - Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!fs.existsSync(usersPath)) {
    return res.send('<h2>No hay usuarios registrados. <a href="/register">Registrarse</a></h2>');
  }

  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  const user = users.find(u => u.email === email);

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = email;
    res.send(`<h2>Bienvenida, ${email} 🌙</h2>`);
  } else {
    res.send('<h2>Correo o contraseña incorrectos. <a href="/">Intentar de nuevo</a></h2>');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
