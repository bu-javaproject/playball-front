import { apiClient, unwrapApiResponse } from '@/shared/api/client';

import type {
  DeviceTokenRequest,
  NotificationSetting,
  NotificationSettingUpdateRequest,
  NotificationsParams,
  NotificationsResponse,
  ReadAllNotificationsResult,
  UnreadNotificationCount,
} from '../types/notification';

export function getNotifications(params: NotificationsParams = {}) {
  return unwrapApiResponse<NotificationsResponse>(
    apiClient.get('/api/notifications', {
      params: {
        cursor: params.cursor,
        size: params.size ?? 20,
        onlyUnread: params.onlyUnread ?? false,
      },
    }),
  );
}

export function getUnreadNotificationCount() {
  return unwrapApiResponse<UnreadNotificationCount>(apiClient.get('/api/notifications/unread-count'));
}

export function markNotificationAsRead(notificationId: number) {
  return unwrapApiResponse<null>(apiClient.patch(`/api/notifications/${notificationId}/read`));
}

export function markAllNotificationsAsRead() {
  return unwrapApiResponse<ReadAllNotificationsResult>(apiClient.patch('/api/notifications/read-all'));
}

export function deleteNotification(notificationId: number) {
  return unwrapApiResponse<null>(apiClient.delete(`/api/notifications/${notificationId}`));
}

export function getNotificationSetting() {
  return unwrapApiResponse<NotificationSetting>(apiClient.get('/api/notifications/settings'));
}

export function updateNotificationSetting(payload: NotificationSettingUpdateRequest) {
  return unwrapApiResponse<NotificationSetting>(apiClient.patch('/api/notifications/settings', payload));
}

export function registerDeviceToken(payload: DeviceTokenRequest) {
  return unwrapApiResponse<null>(apiClient.post('/api/devices/token', payload));
}

export function deleteDeviceToken(token: string) {
  return unwrapApiResponse<null>(
    apiClient.delete('/api/devices/token', {
      params: { token },
    }),
  );
}
