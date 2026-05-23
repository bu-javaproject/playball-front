export type NoticeType =
  | 'MATCH_FOUND'
  | 'APPLICATION_REJECTED'
  | 'MATCH_REMINDER'
  | 'MATCH_CANCELLED'
  | 'RATING_REQUEST'
  | 'SYSTEM_NOTICE';

export type NotificationTargetType = 'MATCH' | 'MEMBER' | 'SYSTEM';
export type DevicePlatform = 'ANDROID' | 'IOS' | 'WEB';

export interface NotificationItem {
  notificationId: number;
  memberId?: number;
  noticeType: NoticeType;
  title: string;
  content: string;
  isRead: boolean;
  targetType?: NotificationTargetType | null;
  targetId?: number | null;
  createdAt: string;
}

export interface NotificationsParams {
  cursor?: number;
  size?: number;
  onlyUnread?: boolean;
}

export interface NotificationsResponse {
  items: NotificationItem[];
  nextCursor?: number | null;
}

export interface UnreadNotificationCount {
  count: number;
}

export interface ReadAllNotificationsResult {
  affected: number;
}

export interface NotificationSetting {
  memberId?: number;
  enabled: boolean;
  updatedAt: string;
}

export interface NotificationSettingUpdateRequest {
  enabled: boolean;
}

export interface DeviceTokenRequest {
  token: string;
  platform: DevicePlatform;
}
