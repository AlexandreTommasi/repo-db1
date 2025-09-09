import { Response } from 'express';

export class ApiResponse {
  private res: Response;

  constructor(res: Response) {
    this.res = res;
  }

  public send<T>(statusCode: number, data: T, message: string = 'Success') {
    this.res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
}
