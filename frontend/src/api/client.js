import { API_BASE_URL } from '../config/env'

export async function apiFetch(path, options) {
  return fetch(`${API_BASE_URL}${path}`, options)
}
