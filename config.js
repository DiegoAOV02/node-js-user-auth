export const {
  PORT = 3000,
  SALT_ROUNDS = 10,
  SECRET_JWT_KEY = 'this-is-an-insecure-secret-key-for-development'
} = process.env
