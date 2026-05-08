export const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''

export const FEATURE_FLAGS = {
  enableTodoDetails: import.meta.env.VITE_ENABLE_TODO_DETAILS !== 'false',
}
