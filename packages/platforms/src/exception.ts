export class ProjectNotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}