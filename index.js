import express from 'express' // express para crear el servidor
import jwt from 'jsonwebtoken' // para los tokens de autenticación
import cookieParser from 'cookie-parser' // parsear las cookies
import { PORT, SECRET_JWT_KEY } from './config.js' // importo el puerto y la clave secreta del archivo de configuración
import { UserRepository } from './user-repository.js' // importo el repositorio de usuarios

const app = express() // Crear la aplicación de express

app.set('view engine', 'ejs') // Configurar el motor de plantillas ejs

app.use(express.json()) // Middleware para parsear el body de las requests
app.use(cookieParser()) // Middleware para parsear las cookies

app.use((req, res, next) => { // Middleware para verificar el token de autenticación
  const token = req.cookies.access_token // -> obtener la cookie de acceso
  req.session = { user: null } // -> inicializar la sesión donde el usuario es null para no estar autenticado

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY) // -> verificar el token con la clave secreta
    req.session.user = data // -> guardar los datos del usuario en la sesión si el token es válido
  } catch (error) {
    req.session.user = null // -> si el token no es válido, el usuario no está autenticado
  }

  next() // -> seguir a la siguiente ruta o middleware
})

app.get('/', (req, res) => {
  const { user } = req.session // -> obtener el usuario de la sesión
  res.render('index', user)
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user._id, username: user.username },
      SECRET_JWT_KEY,
      {
        expiresIn: '1h'
      })
    res
      .cookie('access_token', token, {
        httpOnly: true, // La cookie solo se puede acceder en el servidor
        secure: process.env.NODE_ENV === 'production', // La cookie solo se puede enviar por HTTPS
        sameSite: 'strict', // la cookie solo se puede acceder en el mismo dominio
        maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de una hora
      })
      .send({ user, token })
  } catch (error) {
    res.status(401).send(error.message)
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  console.log({ username, password })

  try {
    const id = await UserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

app.post('/logout', (req, res) => {
  res
    .clearCookie('access_token')
    .json({ message: 'Logout successful' })
})

app.get('/protected', (req, res) => {
  const { user } = req.session
  if (!user) return res.status(403).send('Access not authorized')
  res.render('protected', user)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
