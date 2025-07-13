// src/app/models/notification.model.ts
export interface Notification {
  id: number;
  message: string;
  status: string;
  notificationType: string;
  createdAt: string;
  referenceId: string;
  isNew: boolean;
}
