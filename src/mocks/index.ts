import { v4 as uuidv4 } from 'uuid';
import {ContentType, UserType, PaymentType, PaymentStatusType} from '@/models';

export const mockContentsData: ContentType[] = [
  {
    id: uuidv4(),
    title: 'Sample Content 1',
    description: 'This is a sample content 1.',
    image: 'https://source.unsplash.com/random/800x600',
    contentType: 'Type A',
    createdAt: new Date("2021-09-01"),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    title: 'Sample Content 2',
    description: 'This is a sample content 2.',
    image: 'https://source.unsplash.com/random/800x601',
    contentType: 'Type B',

    createdAt: new Date(),
    updatedAt: new Date("2021-09-01"),
  },
];

export const mockUsersData: UserType[] = [
  {
    id: uuidv4(),
    username: 'Sample User 1',
    email: 'user1@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    username: 'Sample User 2',
    email: 'user2@example.com',

    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockPaymentsData: PaymentType[] = [
  {
    id: uuidv4(),
    status: PaymentStatusType.SUCCESS,
    username: 'User1',
    email: 'user1@example.com',
    amount: 100,
    subscriptionType: 'Monthly',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    status: PaymentStatusType.FAILED,
    username: 'User2',
    email: 'user2@example.com',
    amount: 200,
    subscriptionType: 'Yearly',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];