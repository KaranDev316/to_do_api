export const MAX_TITLE_LENGTH = 120
export const MAX_DESCRIPTION_LENGTH = 500

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

export function getTodoDescriptionValidation(description) {
  const trimmedDescription = description.trim()
  const isTooLong = description.length > MAX_DESCRIPTION_LENGTH

  return {
    trimmedDescription,
    isTooLong,
    validationError: `Todo description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer`,
  }
}
