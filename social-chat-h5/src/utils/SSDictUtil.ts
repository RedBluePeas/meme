/**
 * 字典工具类 (Social chat Service Dict Util)
 * 统一管理枚举值、下拉选项等字典数据
 */

/**
 * 字典项接口
 */
interface DictItem {
  value: string | number;
  label: string;
  [key: string]: unknown;
}

export class SSDictUtil {
  /**
   * 用户状态字典
   */
  static readonly USER_STATUS = {
    ACTIVE: { value: 'active', label: '正常', color: 'success' },
    INACTIVE: { value: 'inactive', label: '停用', color: 'default' },
    BANNED: { value: 'banned', label: '封禁', color: 'danger' }
  };

  /**
   * 消息类型字典
   */
  static readonly MESSAGE_TYPE = {
    TEXT: { value: 'text', label: '文字消息', icon: '💬' },
    IMAGE: { value: 'image', label: '图片消息', icon: '🖼️' },
    VIDEO: { value: 'video', label: '视频消息', icon: '🎬' },
    AUDIO: { value: 'audio', label: '语音消息', icon: '🎤' },
    FILE: { value: 'file', label: '文件消息', icon: '📎' },
    LOCATION: { value: 'location', label: '位置消息', icon: '📍' }
  };

  /**
   * 消息状态字典
   */
  static readonly MESSAGE_STATUS = {
    SENDING: { value: 'sending', label: '发送中', color: 'default' },
    SENT: { value: 'sent', label: '已发送', color: 'default' },
    DELIVERED: { value: 'delivered', label: '已送达', color: 'primary' },
    READ: { value: 'read', label: '已读', color: 'success' },
    FAILED: { value: 'failed', label: '失败', color: 'danger' }
  };

  /**
   * 动态可见性字典
   */
  static readonly POST_VISIBILITY = {
    PUBLIC: { value: 'public', label: '公开', icon: '🌐', desc: '所有人可见' },
    FRIENDS: { value: 'friends', label: '好友可见', icon: '👥', desc: '仅好友可见' },
    PRIVATE: { value: 'private', label: '私密', icon: '🔒', desc: '仅自己可见' }
  };

  /**
   * 性别字典
   */
  static readonly GENDER = {
    MALE: { value: 'male', label: '男', icon: '♂️' },
    FEMALE: { value: 'female', label: '女', icon: '♀️' },
    OTHER: { value: 'other', label: '其他', icon: '⚧' }
  };

  /**
   * 通知类型字典
   */
  static readonly NOTIFICATION_TYPE = {
    MESSAGE: { value: 'message', label: '消息通知', icon: '💬' },
    FRIEND_REQUEST: { value: 'friend_request', label: '好友请求', icon: '👥' },
    LIKE: { value: 'like', label: '点赞通知', icon: '❤️' },
    COMMENT: { value: 'comment', label: '评论通知', icon: '💭' },
    SYSTEM: { value: 'system', label: '系统通知', icon: '📢' }
  };

  /**
   * 文件类型字典
   */
  static readonly FILE_TYPE = {
    IMAGE: { value: 'image', label: '图片', extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'] },
    VIDEO: { value: 'video', label: '视频', extensions: ['.mp4', '.mov', '.avi', '.wmv'] },
    AUDIO: { value: 'audio', label: '音频', extensions: ['.mp3', '.wav', '.ogg', '.m4a'] },
    DOCUMENT: { value: 'document', label: '文档', extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'] },
    ARCHIVE: { value: 'archive', label: '压缩包', extensions: ['.zip', '.rar', '.7z', '.tar', '.gz'] },
    OTHER: { value: 'other', label: '其他', extensions: [] }
  };

  /**
   * 主题模式字典
   */
  static readonly THEME_MODE = {
    LIGHT: { value: 'light', label: '浅色模式', icon: '☀️' },
    DARK: { value: 'dark', label: '深色模式', icon: '🌙' },
    AUTO: { value: 'auto', label: '跟随系统', icon: '🔄' }
  };

  /**
   * 语言字典
   */
  static readonly LANGUAGE = {
    ZH_CN: { value: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
    ZH_TW: { value: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
    EN_US: { value: 'en-US', label: 'English', flag: '🇺🇸' }
  };

  /**
   * 根据value获取label
   * @param dict - 字典对象
   * @param value - 值
   * @returns label，找不到返回原value
   *
   * @example
   * const label = SSDictUtil.getLabel(SSDictUtil.USER_STATUS, 'active'); // '正常'
   */
  static getLabel(dict: Record<string, DictItem>, value: string | number): string {
    const item = Object.values(dict).find((item) => item.value === value);
    return item?.label || String(value);
  }

  /**
   * 根据value获取完整的字典项
   * @param dict - 字典对象
   * @param value - 值
   * @returns 字典项，找不到返回undefined
   *
   * @example
   * const item = SSDictUtil.getItem(SSDictUtil.MESSAGE_TYPE, 'text');
   * // { value: 'text', label: '文字消息', icon: '💬' }
   */
  static getItem(dict: Record<string, DictItem>, value: string | number): DictItem | undefined {
    return Object.values(dict).find((item) => item.value === value);
  }

  /**
   * 获取字典数组（用于下拉选项）
   * @param dict - 字典对象
   * @returns 字典数组
   *
   * @example
   * const options = SSDictUtil.toArray(SSDictUtil.GENDER);
   * // [{ value: 'male', label: '男', icon: '♂️' }, ...]
   */
  static toArray(dict: Record<string, DictItem>): DictItem[] {
    return Object.values(dict);
  }

  /**
   * 获取字典的所有值
   * @param dict - 字典对象
   * @returns 值数组
   *
   * @example
   * const values = SSDictUtil.getValues(SSDictUtil.USER_STATUS);
   * // ['active', 'inactive', 'banned']
   */
  static getValues(dict: Record<string, DictItem>): (string | number)[] {
    return Object.values(dict).map((item) => item.value);
  }

  /**
   * 获取字典的所有标签
   * @param dict - 字典对象
   * @returns 标签数组
   *
   * @example
   * const labels = SSDictUtil.getLabels(SSDictUtil.USER_STATUS);
   * // ['正常', '停用', '封禁']
   */
  static getLabels(dict: Record<string, DictItem>): string[] {
    return Object.values(dict).map((item) => item.label);
  }

  /**
   * 检查值是否在字典中
   * @param dict - 字典对象
   * @param value - 值
   * @returns 是否存在
   */
  static has(dict: Record<string, DictItem>, value: string | number): boolean {
    return this.getValues(dict).includes(value);
  }

  /**
   * 根据label获取value
   * @param dict - 字典对象
   * @param label - 标签
   * @returns 值，找不到返回undefined
   *
   * @example
   * const value = SSDictUtil.getValueByLabel(SSDictUtil.GENDER, '男'); // 'male'
   */
  static getValueByLabel(dict: Record<string, DictItem>, label: string): string | number | undefined {
    const item = Object.values(dict).find((item) => item.label === label);
    return item?.value;
  }

  /**
   * 获取属性值（如color、icon等）
   * @param dict - 字典对象
   * @param value - 值
   * @param prop - 属性名
   * @returns 属性值
   *
   * @example
   * const color = SSDictUtil.getProp(SSDictUtil.USER_STATUS, 'active', 'color'); // 'success'
   */
  static getProp(
    dict: Record<string, DictItem>,
    value: string | number,
    prop: string
  ): unknown {
    const item = this.getItem(dict, value);
    return item?.[prop];
  }

  /**
   * 根据文件扩展名获取文件类型
   * @param filename - 文件名
   * @returns 文件类型
   *
   * @example
   * SSDictUtil.getFileType('photo.jpg') // { value: 'image', label: '图片', ... }
   */
  static getFileType(filename: string): DictItem {
    const ext = ('.' + filename.split('.').pop()?.toLowerCase()) || '';

    for (const type of Object.values(this.FILE_TYPE)) {
      if (type.extensions.includes(ext)) {
        return type;
      }
    }

    return this.FILE_TYPE.OTHER;
  }
}

/**
 * 导出常用字典，方便使用
 */
export const {
  USER_STATUS,
  MESSAGE_TYPE,
  MESSAGE_STATUS,
  POST_VISIBILITY,
  GENDER,
  NOTIFICATION_TYPE,
  FILE_TYPE,
  THEME_MODE,
  LANGUAGE
} = SSDictUtil;
