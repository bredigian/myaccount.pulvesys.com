export interface APIError {
  error: string;
  statusCode: number;
  message: string;
  response?: {
    statusCode?: number;
    error?: string;
    message?: string;
  };
  extras: {
    domain: string;
  };
}
