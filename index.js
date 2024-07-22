import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs')

app.use(express.json()) // Middleware para parsear el body de las requests
app.use(cookieParser()) // Middleware para parsear las cookies

app.use((req, res, next) => {
  const token = req.cookies.access_token
  let data = null

  req.session = { user: null }

  try {
    data = jwt.verify(token, SECRET_JWT_KEY)
    req.session.user = data
  } catch {}

  next() // -> seguir a la siguiente ruta o middleware
})

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('index', user)
})

// Endpoints a desarrollar.
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
  console.log(req.body)

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
