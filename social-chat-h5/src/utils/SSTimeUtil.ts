import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 扩展相对时间插件
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 时间工具类 (Social chat Service Time Util)
 * 统一处理项目中所有时间相关操作
 */
export class SSTimeUtil {
  /**
   * 格式化时间
   * @param date - 日期对象、时间戳或字符串
   * @param format - 格式字符串，默认 'YYYY-MM-DD HH:mm:ss'
   * @returns 格式化后的时间字符串
   *
   * @example
   * SSTimeUtil.format(new Date()) // '2025-11-06 10:30:00'
   * SSTimeUtil.format(1699267200000, 'YYYY-MM-DD') // '2025-11-06'
   */
  static format(date: Date | number | string, format = 'YYYY-MM-DD HH:mm:ss'): string {
    if (!date) return '';
    return dayjs(date).format(format);
  }

  /**
   * 获取相对时间（刚刚、5分钟前、1小时前等）
   * @param timestamp - 时间戳或日期对象
   * @returns 相对时间字符串
   *
   * @example
   * SSTimeUtil.relative(Date.now() - 60000) // '1分钟前'
   * SSTimeUtil.relative(Date.now() - 3600000) // '1小时前'
   */
  static relative(timestamp: number | Date | string): string {
    if (!timestamp) return '';

    const now = dayjs();
    const target = dayjs(timestamp);
    const diffSeconds = now.diff(target, 'second');

    // 刚刚（1分钟内）
    if (diffSeconds < 60) {
      return '刚刚';
    }

    // XMarkIcon分钟前（1小时内）
    if (diffSeconds < 3600) {
      return `${Math.floor(diffSeconds / 60)}分钟前`;
    }

    // XMarkIcon小时前（24小时内）
    if (diffSeconds < 86400) {
      return `${Math.floor(diffSeconds / 3600)}小时前`;
    }

    // 昨天
    if (diffSeconds < 172800 && target.date() === now.subtract(1, 'day').date()) {
      return `昨天 ${target.format('HH:mm')}`;
    }

    // 前天
    if (diffSeconds < 259200 && target.date() === now.subtract(2, 'day').date()) {
      return `前天 ${target.format('HH:mm')}`;
    }

    // 今年内显示月-日
    if (target.year() === now.year()) {
      return target.format('MM-DD HH:mm');
    }

    // 跨年显示完整日期
    return target.format('YYYY-MM-DD');
  }

  /**
   * 判断是否是今天
   * @param date - 日期对象或时间戳
   * @returns 是否是今天
   *
   * @example
   * SSTimeUtil.isToday(new Date()) // true
   */
  static isToday(date: Date | number | string): boolean {
    if (!date) return false;
    return dayjs(date).isSame(dayjs(), 'day');
  }

  /**
   * 判断是否是昨天
   * @param date - 日期对象或时间戳
   * @returns 是否是昨天
   */
  static isYesterday(date: Date | number | string): boolean {
    if (!date) return false;
    return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day');
  }

  /**
   * 判断是否是本周
   * @param date - 日期对象或时间戳
   * @returns 是否是本周
   */
  static isThisWeek(date: Date | number | string): boolean {
    if (!date) return false;
    return dayjs(date).isSame(dayjs(), 'week');
  }

  /**
   * 计算时间差
   * @param start - 开始时间
   * @param end - 结束时间
   * @param unit - 单位（默认为秒）
   * @returns 时间差
   *
   * @example
   * SSTimeUtil.diff(start, end, 'day') // 返回天数差
   */
  static diff(
    start: Date | number | string,
    end: Date | number | string,
    unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' = 'second'
  ): number {
    return dayjs(end).diff(dayjs(start), unit);
  }

  /**
   * 获取时间戳
   * @param date - 日期对象或字符串，不传则返回当前时间戳
   * @returns 时间戳（毫秒）
   *
   * @example
   * SSTimeUtil.timestamp() // 当前时间戳
   * SSTimeUtil.timestamp('2025-11-06') // 指定日期的时间戳
   */
  static timestamp(date?: Date | string): number {
    return date ? dayjs(date).valueOf() : Date.now();
  }

  /**
   * 格式化聊天消息时间
   * 今天显示 HH:mm
   * 昨天显示 昨天 HH:mm
   * 更早显示 MM-DD HH:mm
   * @param timestamp - 时间戳
   * @returns 格式化的时间字符串
   */
  static formatChatTime(timestamp: number | Date | string): string {
    if (!timestamp) return '';

    const target = dayjs(timestamp);
    const now = dayjs();

    if (this.isToday(timestamp)) {
      return target.format('HH:mm');
    }

    if (this.isYesterday(timestamp)) {
      return `昨天 ${target.format('HH:mm')}`;
    }

    if (target.year() === now.year()) {
      return target.format('MM-DD HH:mm');
    }

    return target.format('YYYY-MM-DD HH:mm');
  }

  /**
   * 添加时间
   * @param date - 原始时间
   * @param amount - 添加的数量
   * @param unit - 单位
   * @returns 新的日期对象
   *
   * @example
   * SSTimeUtil.add(new Date(), 1, 'day') // 明天的这个时候
   */
  static add(
    date: Date | number | string,
    amount: number,
    unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
  ): Date {
    return dayjs(date).add(amount, unit).toDate();
  }

  /**
   * 减去时间
   * @param date - 原始时间
   * @param amount - 减去的数量
   * @param unit - 单位
   * @returns 新的日期对象
   */
  static subtract(
    date: Date | number | string,
    amount: number,
    unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
  ): Date {
    return dayjs(date).subtract(amount, unit).toDate();
  }

  /**
   * 获取一天的开始时间（00:00:00）
   * @param date - 日期
   * @returns 开始时间
   */
  static startOfDay(date: Date | number | string = new Date()): Date {
    return dayjs(date).startOf('day').toDate();
  }

  /**
   * 获取一天的结束时间（23:59:59）
   * @param date - 日期
   * @returns 结束时间
   */
  static endOfDay(date: Date | number | string = new Date()): Date {
    return dayjs(date).endOf('day').toDate();
  }
}
