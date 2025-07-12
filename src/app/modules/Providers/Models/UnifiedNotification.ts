export interface UnifiedNotification {
  id?: number;
  message: string;
  status: string;
  notificationType: string;
  createdAt?: string;
  referenceId?: string;
  isNew?: boolean;
}
