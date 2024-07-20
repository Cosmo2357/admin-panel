export type  ColumnType = {
    accessorKey: string;
    header: string;
  }
export type ContentType =  {
  id: string;
  title: string;
  description: string;
  image: string | ArrayBuffer | null;
  contentType: string;
  createdAt: Date,
  updatedAt: Date ;
}

export enum PaymentStatusType  {
  PENDING = 'pending',
  Paid = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  SUCCESS = 'success'
}

export type PaymentType = {
  id: string;
  status: PaymentStatusType;
  username: string;
  email: string;
  amount: number;
  subscriptionType: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserType = {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}