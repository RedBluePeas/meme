/**
 * Topic 话题模型类型定义
 */

/**
 * 话题模型
 */
export interface Topic {
  id: string;
  name: string;
  description: string;
  cover?: string;

  // 统计数据
  postCount: number;
  memberCount: number;
  viewCount: number;

  // 用户关系
  isFollowed: boolean;

  // 时间戳
  createdAt: string;
  updatedAt: string;
}

/**
 * 话题分类
 */
export interface TopicCategory {
  id: string;
  name: string;
  icon?: string;
  topicCount: number;
}
