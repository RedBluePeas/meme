/**
 * 字符串工具类 (Social chat Service String Util)
 * 处理字符串格式化、截取、脱敏等操作
 */
export class SSStringUtil {
  /**
   * 手机号脱敏
   * @param phone - 手机号
   * @returns 脱敏后的手机号
   *
   * @example
   * SSStringUtil.maskPhone('13812345678') // '138****5678'
   */
  static maskPhone(phone: string): string {
    if (!phone || phone.length !== 11) return phone;
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  /**
   * 邮箱脱敏
   * @param email - 邮箱地址
   * @returns 脱敏后的邮箱
   *
   * @example
   * SSStringUtil.maskEmail('test@example.com') // 't***@example.com'
   */
  static maskEmail(email: string): string {
    if (!email) return email;
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    const maskedName = name.charAt(0) + '***';
    return `${maskedName}@${domain}`;
  }

  /**
   * 姓名脱敏
   * @param name - 姓名
   * @returns 脱敏后的姓名
   *
   * @example
   * SSStringUtil.maskName('张三') // '张*'
   * SSStringUtil.maskName('欧阳娜娜') // '欧**娜'
   */
  static maskName(name: string): string {
    if (!name) return name;
    if (name.length <= 2) {
      return name.charAt(0) + '*';
    }
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  }

  /**
   * 字符串截取（超出显示省略号）
   * @param str - 原始字符串
   * @param maxLength - 最大长度
   * @param suffix - 后缀（默认为'...'）
   * @returns 截取后的字符串
   *
   * @example
   * SSStringUtil.ellipsis('这是一段很长的文字', 10) // '这是一段很长的文...'
   */
  static ellipsis(str: string, maxLength: number, suffix = '...'): string {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength) + suffix;
  }

  /**
   * 首字母大写
   * @param str - 原始字符串
   * @returns 首字母大写的字符串
   *
   * @example
   * SSStringUtil.capitalize('hello') // 'Hello'
   */
  static capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * 全部转大写
   * @param str - 原始字符串
   * @returns 大写字符串
   */
  static toUpperCase(str: string): string {
    return str ? str.toUpperCase() : str;
  }

  /**
   * 全部转小写
   * @param str - 原始字符串
   * @returns 小写字符串
   */
  static toLowerCase(str: string): string {
    return str ? str.toLowerCase() : str;
  }

  /**
   * 驼峰转下划线
   * @param str - 驼峰命名字符串
   * @returns 下划线命名字符串
   *
   * @example
   * SSStringUtil.camelToSnake('userName') // 'user_name'
   * SSStringUtil.camelToSnake('getUserName') // 'get_user_name'
   */
  static camelToSnake(str: string): string {
    if (!str) return str;
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  }

  /**
   * 下划线转驼峰
   * @param str - 下划线命名字符串
   * @returns 驼峰命名字符串
   *
   * @example
   * SSStringUtil.snakeToCamel('user_name') // 'userName'
   * SSStringUtil.snakeToCamel('get_user_name') // 'getUserName'
   */
  static snakeToCamel(str: string): string {
    if (!str) return str;
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * 移除字符串中的HTML标签
   * @param str - 包含HTML的字符串
   * @returns 纯文本字符串
   *
   * @example
   * SSStringUtil.removeHtmlTags('<p>Hello</p>') // 'Hello'
   */
  static removeHtmlTags(str: string): string {
    if (!str) return str;
    return str.replace(/<[^>]*>/g, '');
  }

  /**
   * 生成随机字符串
   * @param length - 长度
   * @param chars - 字符集（默认为数字+字母）
   * @returns 随机字符串
   *
   * @example
   * SSStringUtil.random(6) // 'aB3xY9'
   */
  static random(
    length: number,
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  ): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 生成UUID
   * @returns UUID字符串
   *
   * @example
   * SSStringUtil.uuid() // 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6'
   */
  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * 统计字符串字数（中文算1个字，英文算0.5个字）
   * @param str - 字符串
   * @returns 字数
   *
   * @example
   * SSStringUtil.countWords('Hello世界') // 6
   */
  static countWords(str: string): number {
    if (!str) return 0;
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      // 中文字符
      if (str.charCodeAt(i) > 255) {
        count += 1;
      } else {
        // 英文字符
        count += 0.5;
      }
    }
    return Math.ceil(count);
  }

  /**
   * 判断是否包含中文
   * @param str - 字符串
   * @returns 是否包含中文
   */
  static hasChinese(str: string): boolean {
    return /[\u4e00-\u9fa5]/.test(str);
  }

  /**
   * 判断是否是URL
   * @param str - 字符串
   * @returns 是否是URL
   */
  static isUrl(str: string): boolean {
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return pattern.test(str);
  }

  /**
   * 格式化文件大小
   * @param bytes - 字节数
   * @param decimals - 小数位数（默认2位）
   * @returns 格式化后的大小字符串
   *
   * @example
   * SSStringUtil.formatFileSize(1024) // '1.00 KB'
   * SSStringUtil.formatFileSize(1048576) // '1.00 MB'
   */
  static formatFileSize(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * 格式化数字（添加千分位逗号）
   * @param num - 数字
   * @returns 格式化后的字符串
   *
   * @example
   * SSStringUtil.formatNumber(1234567) // '1,234,567'
   */
  static formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * 高亮关键词
   * @param text - 原文本
   * @param keyword - 关键词
   * @param className - 高亮样式类名
   * @returns 包含高亮标签的HTML字符串
   *
   * @example
   * SSStringUtil.highlight('Hello World', 'World', 'highlight')
   * // 'Hello <span class="highlight">World</span>'
   */
  static highlight(text: string, keyword: string, className = 'highlight'): string {
    if (!text || !keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, `<span class="${className}">$1</span>`);
  }

  /**
   * 去除字符串首尾空格
   * @param str - 字符串
   * @returns 去除空格后的字符串
   */
  static trim(str: string): string {
    return str ? str.trim() : str;
  }

  /**
   * 去除字符串所有空格
   * @param str - 字符串
   * @returns 去除所有空格后的字符串
   */
  static trimAll(str: string): string {
    return str ? str.replace(/\s+/g, '') : str;
  }
}
