/**
 * 数据验证工具类 (Social chat Service Validate Util)
 * 处理所有非空判断、类型校验、格式验证
 */
export class SSValidateUtil {
  /**
   * 非空判断（null、undefined、空字符串）
   * @param value - 待验证的值
   * @returns 是否不为空
   *
   * @example
   * SSValidateUtil.isNotEmpty('hello') // true
   * SSValidateUtil.isNotEmpty('') // false
   * SSValidateUtil.isNotEmpty(null) // false
   */
  static isNotEmpty(value: unknown): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  /**
   * 判断是否为空
   * @param value - 待验证的值
   * @returns 是否为空
   */
  static isEmpty(value: unknown): boolean {
    return !this.isNotEmpty(value);
  }

  /**
   * 邮箱验证
   * @param email - 邮箱地址
   * @returns 是否是有效的邮箱
   *
   * @example
   * SSValidateUtil.isEmail('test@example.com') // true
   * SSValidateUtil.isEmail('invalid-email') // false
   */
  static isEmail(email: string): boolean {
    if (!email) return false;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  /**
   * 手机号验证（中国大陆）
   * @param phone - 手机号
   * @returns 是否是有效的手机号
   *
   * @example
   * SSValidateUtil.isPhone('13812345678') // true
   * SSValidateUtil.isPhone('12345678901') // false
   */
  static isPhone(phone: string): boolean {
    if (!phone) return false;
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phone);
  }

  /**
   * 固定电话验证
   * @param tel - 固定电话
   * @returns 是否是有效的固定电话
   *
   * @example
   * SSValidateUtil.isTel('010-12345678') // true
   * SSValidateUtil.isTel('0571-87654321') // true
   */
  static isTel(tel: string): boolean {
    if (!tel) return false;
    const regex = /^0\d{2,3}-?\d{7,8}$/;
    return regex.test(tel);
  }

  /**
   * 身份证号验证（中国大陆）
   * @param idCard - 身份证号
   * @returns 是否是有效的身份证号
   *
   * @example
   * SSValidateUtil.isIdCard('110101199003077777') // true
   */
  static isIdCard(idCard: string): boolean {
    if (!idCard) return false;
    // 18位身份证正则
    const regex18 = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    // 15位身份证正则
    const regex15 = /^[1-9]\d{5}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}$/;

    if (idCard.length === 18) {
      return regex18.test(idCard);
    } else if (idCard.length === 15) {
      return regex15.test(idCard);
    }
    return false;
  }

  /**
   * URL验证
   * @param url - URL地址
   * @returns 是否是有效的URL
   *
   * @example
   * SSValidateUtil.isUrl('https://www.example.com') // true
   * SSValidateUtil.isUrl('not-a-url') // false
   */
  static isUrl(url: string): boolean {
    if (!url) return false;
    const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return regex.test(url);
  }

  /**
   * 密码强度验证（至少8位，包含大小写字母和数字）
   * @param password - 密码
   * @returns 是否符合强密码要求
   *
   * @example
   * SSValidateUtil.isStrongPassword('Abc12345') // true
   * SSValidateUtil.isStrongPassword('123456') // false
   */
  static isStrongPassword(password: string): boolean {
    if (!password || password.length < 8) return false;
    // 至少包含：小写字母、大写字母、数字
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  /**
   * 密码强度等级（1-4级）
   * @param password - 密码
   * @returns 强度等级 1-弱 2-中 3-强 4-很强
   *
   * @example
   * SSValidateUtil.getPasswordStrength('123456') // 1
   * SSValidateUtil.getPasswordStrength('Abc12345') // 3
   */
  static getPasswordStrength(password: string): number {
    if (!password) return 0;

    let strength = 0;

    // 长度 >= 8
    if (password.length >= 8) strength++;
    // 长度 >= 12
    if (password.length >= 12) strength++;
    // 包含小写字母
    if (/[a-z]/.test(password)) strength++;
    // 包含大写字母
    if (/[A-Z]/.test(password)) strength++;
    // 包含数字
    if (/\d/.test(password)) strength++;
    // 包含特殊字符
    if (/[@$!%*?&]/.test(password)) strength++;

    // 映射到1-4级
    if (strength <= 2) return 1; // 弱
    if (strength <= 3) return 2; // 中
    if (strength <= 4) return 3; // 强
    return 4; // 很强
  }

  /**
   * 用户名验证（4-20位，字母、数字、下划线）
   * @param username - 用户名
   * @returns 是否符合用户名规则
   *
   * @example
   * SSValidateUtil.isUsername('user_123') // true
   * SSValidateUtil.isUsername('ab') // false (太短)
   */
  static isUsername(username: string): boolean {
    if (!username) return false;
    const regex = /^[a-zA-Z0-9_]{4,20}$/;
    return regex.test(username);
  }

  /**
   * 必填项验证（用于表单）
   * @param value - 值
   * @param fieldName - 字段名称
   * @returns 错误信息，无错误返回null
   *
   * @example
   * const error = SSValidateUtil.required(username, '用户名');
   * if (error) Toast.show(error);
   */
  static required(value: unknown, fieldName: string): string | null {
    if (!this.isNotEmpty(value)) {
      return `${fieldName}不能为空`;
    }
    return null;
  }

  /**
   * 长度验证
   * @param value - 值
   * @param minLength - 最小长度
   * @param maxLength - 最大长度
   * @param fieldName - 字段名称
   * @returns 错误信息，无错误返回null
   */
  static length(
    value: string,
    minLength: number,
    maxLength: number,
    fieldName: string
  ): string | null {
    if (!value) return null;

    if (value.length < minLength) {
      return `${fieldName}长度不能少于${minLength}个字符`;
    }

    if (value.length > maxLength) {
      return `${fieldName}长度不能超过${maxLength}个字符`;
    }

    return null;
  }

  /**
   * 数组非空验证
   * @param arr - 数组
   * @returns 是否非空数组
   *
   * @example
   * SSValidateUtil.isArrayNotEmpty([1, 2, 3]) // true
   * SSValidateUtil.isArrayNotEmpty([]) // false
   */
  static isArrayNotEmpty<T>(arr: T[]): boolean {
    return Array.isArray(arr) && arr.length > 0;
  }

  /**
   * 对象非空验证
   * @param obj - 对象
   * @returns 是否非空对象
   *
   * @example
   * SSValidateUtil.isObjectNotEmpty({ name: 'test' }) // true
   * SSValidateUtil.isObjectNotEmpty({}) // false
   */
  static isObjectNotEmpty(obj: object): boolean {
    return obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0;
  }

  /**
   * 数字验证
   * @param value - 值
   * @returns 是否是数字
   */
  static isNumber(value: unknown): boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  /**
   * 正整数验证
   * @param value - 值
   * @returns 是否是正整数
   */
  static isPositiveInteger(value: unknown): boolean {
    return this.isNumber(value) && Number(value) > 0 && Number.isInteger(Number(value));
  }

  /**
   * 范围验证
   * @param value - 值
   * @param min - 最小值
   * @param max - 最大值
   * @returns 是否在范围内
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return this.isNumber(value) && value >= min && value <= max;
  }

  /**
   * 图片文件验证
   * @param file - 文件对象
   * @param maxSize - 最大大小（字节），默认5MB
   * @returns 验证结果 { valid: boolean, message?: string }
   */
  static validateImage(
    file: File,
    maxSize = 5 * 1024 * 1024
  ): { valid: boolean; message?: string } {
    if (!file) {
      return { valid: false, message: '请选择文件' };
    }

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, message: '只支持 JPG、PNG、GIF、WebP 格式的图片' };
    }

    // 验证文件大小
    if (file.size > maxSize) {
      return { valid: false, message: `图片大小不能超过${maxSize / 1024 / 1024}MB` };
    }

    return { valid: true };
  }

  /**
   * 视频文件验证
   * @param file - 文件对象
   * @param maxSize - 最大大小（字节），默认100MB
   * @returns 验证结果
   */
  static validateVideo(
    file: File,
    maxSize = 100 * 1024 * 1024
  ): { valid: boolean; message?: string } {
    if (!file) {
      return { valid: false, message: '请选择文件' };
    }

    // 验证文件类型
    const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, message: '只支持 MP4、MOV、AVI 格式的视频' };
    }

    // 验证文件大小
    if (file.size > maxSize) {
      return { valid: false, message: `视频大小不能超过${maxSize / 1024 / 1024}MB` };
    }

    return { valid: true };
  }

  /**
   * 中文验证
   * @param str - 字符串
   * @returns 是否全是中文
   */
  static isChinese(str: string): boolean {
    if (!str) return false;
    const regex = /^[\u4e00-\u9fa5]+$/;
    return regex.test(str);
  }

  /**
   * 英文验证
   * @param str - 字符串
   * @returns 是否全是英文
   */
  static isEnglish(str: string): boolean {
    if (!str) return false;
    const regex = /^[a-zA-Z]+$/;
    return regex.test(str);
  }

  /**
   * 银行卡号验证（Luhn算法）
   * @param cardNo - 银行卡号
   * @returns 是否是有效的银行卡号
   */
  static isBankCard(cardNo: string): boolean {
    if (!cardNo || !/^\d{16,19}$/.test(cardNo)) return false;

    let sum = 0;
    let isDouble = false;

    for (let i = cardNo.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNo[i]);

      if (isDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isDouble = !isDouble;
    }

    return sum % 10 === 0;
  }
}
