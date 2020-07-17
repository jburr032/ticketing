import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode: number = 500;
  reasons: string = "Error connecting to database";

  constructor() {
    super("Error connecting to database");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeError() {
    return [{ message: this.reasons }];
  }
}
