export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, context: string): Error {
  console.error(`${context}:`, error);

  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      error.message || 'Ocorreu um erro inesperado',
      undefined,
      error
    );
  }

  return new AppError('Ocorreu um erro inesperado');
}