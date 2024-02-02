export type ErrorResponseType = {
  time?: Date;
  message: string;
  statusCode: number;
  errorCode?: string;
  // fieldErrors?: RieldErrorType[]
};

type FieldErrorType = {
  field: string;
  message: string;
  errorCode: string;
};
