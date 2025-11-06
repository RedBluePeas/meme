/**
 * Format 格式化工具
 */

/**
 * 格式化时间
 * - 今天：显示时间 HH:mm
 * - 昨天：显示 "昨天 HH:mm"
 * - 今年：显示 MM-DD HH:mm
 * - 往年：显示 YYYY-MM-DD HH:mm
 */
export function formatTime(time: string | Date): string {
  const date = typeof time === 'string' ? new Date(time) : time;
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isYesterday =
    date.getDate() === now.getDate() - 1 &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isThisYear = date.getFullYear() === now.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  if (isToday) {
    return `${hours}:${minutes}`;
  }

  if (isYesterday) {
    return `昨天 ${hours}:${minutes}`;
  }

  if (isThisYear) {
    return `${month}-${day} ${hours}:${minutes}`;
  }

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 格式化相对时间
 * - 刚刚：1分钟内
 * - N分钟前：60分钟内
 * - N小时前：24小时内
 * - N天前：7天内
 * - 具体日期：超过7天
 */
export function formatRelativeTime(time: string | Date): string {
  const date = typeof time === 'string' ? new Date(time) : time;
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return '刚刚';
  }

  if (minutes < 60) {
    return `${minutes}分钟前`;
  }

  if (hours < 24) {
    return `${hours}小时前`;
  }

  if (days < 7) {
    return `${days}天前`;
  }

  return formatTime(date);
}

/**
 * 格式化数字
 * - 小于1万：显示原数字
 * - 大于1万：显示 XMarkIcon.XMarkIcon万
 * - 大于1亿：显示 XMarkIcon.XMarkIcon亿
 */
export function formatNumber(num: number): string {
  if (num < 10000) {
    return num.toString();
  }

  if (num < 100000000) {
    return (num / 10000).toFixed(1) + '万';
  }

  return (num / 100000000).toFixed(1) + '亿';
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + ' B';
  }

  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  }

  if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}
