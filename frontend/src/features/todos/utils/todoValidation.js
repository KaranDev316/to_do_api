export const MAX_TITLE_LENGTH = 120

export function getTodoTitleValidation(title) {
  const trimmedTitle = title.trim()
  const isEmpty = trimmedTitle.length === 0
  const isTooLong = title.length > MAX_TITLE_LENGTH

  return {
    trimmedTitle,
    isEmpty,
    isTooLong,
    validationError: isTooLong
      ? `Todo title must be ${MAX_TITLE_LENGTH} characters or fewer`
      : 'Todo title is required',
  }
}
