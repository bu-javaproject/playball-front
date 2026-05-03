export function formatDistance(distance?: number) {
  if (distance === undefined || distance === null) return '거리 정보 없음';
  if (distance < 1) return `${Math.round(distance * 1000)}m`;
  return `${distance.toFixed(1)}km`;
}
