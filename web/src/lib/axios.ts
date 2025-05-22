import axios from 'axios'
import { env } from '../env'

export const api = axios.create({
  baseURL: env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
