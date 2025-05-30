export interface APIResponse<T> {
  IsSuccess: boolean;
  Message: string;
  Data: T;
  StatusCode: number;
}
