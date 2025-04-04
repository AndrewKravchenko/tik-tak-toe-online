export type Left<ErrorType> = {
  type: 'left'
  error: ErrorType
}

export type Right<SuccessType> = {
  type: 'right'
  value: SuccessType
}

export type Either<ErrorType, SuccessType> = Left<ErrorType> | Right<SuccessType>

export const left = <ErrorType>(error: ErrorType): Left<ErrorType> => ({
  error,
  type: 'left',
})

export const right = <SuccessType>(value: SuccessType): Right<SuccessType> => ({
  type: 'right',
  value: value,
})

export const mapRight = <SuccessType, NewSuccessType, ErrorType = unknown>(
  either: Either<ErrorType, SuccessType>,
  fn: (value: SuccessType) => NewSuccessType,
): Either<ErrorType, NewSuccessType> => {
  if (either.type === 'right') {
    return right(fn(either.value))
  }

  return either
}

export const mapLeft = <SuccessType, ErrorType, NewErrorType>(
  either: Either<ErrorType, SuccessType>,
  fn: (value: ErrorType) => NewErrorType,
): Either<NewErrorType, SuccessType> => {
  if (either.type === 'left') {
    return left(fn(either.error))
  }

  return either
}

export const matchEither = <ErrorType, SuccessType, ReturnType>(
  either: Either<ErrorType, SuccessType>,
  matchers: {
    left: (error: ErrorType) => ReturnType
    right: (value: SuccessType) => ReturnType
  },
): ReturnType => {
  if (either.type === 'left') {
    return matchers.left(either.error)
  }

  return matchers.right(either.value)
}
