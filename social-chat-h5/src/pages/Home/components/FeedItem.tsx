/**
 * FeedItem - 内容流单项组件
 */

import React from 'react';
import { Avatar, Card, CardBody, CardFooter, Image } from '@heroui/react';
import { Heart, MessageCircle, Share2, MoreVertical } from '@heroicons/react/24/outline';
import type { Feed } from '@/types';
import { SSTimeUtil } from '@/utils';

interface FeedItemProps {
  feed: Feed;
  onLike?: (feedId: string, isLiked: boolean) => void;
  onComment?: (feedId: string) => void;
  onShare?: (feedId: string) => void;
  onClick?: (feedId: string) => void;
}

export const FeedItem: React.FC<FeedItemProps> = ({
  feed,
  onLike,
  onComment,
  onShare,
  onClick,
}) => {
  /**
   * 渲染图片网格
   */
  const renderImages = () => {
    if (!feed.images || feed.images.length === 0) {
      return null;
    }

    const imageCount = feed.images.length;

    // 单张图片
    if (imageCount === 1) {
      return (
        <div className="mt-3">
          <Image
            src={feed.images[0]}
            alt="post image"
            className="w-full rounded-lg object-cover max-h-96"
          />
        </div>
      );
    }

    // 多张图片网格
    const gridClass =
      imageCount === 2
        ? 'grid-cols-2'
        : imageCount === 3
        ? 'grid-cols-3'
        : imageCount === 4
        ? 'grid-cols-2'
        : 'grid-cols-3';

    return (
      <div className={`mt-3 grid ${gridClass} gap-2`}>
        {feed.images.slice(0, 9).map((image, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={image}
              alt={`image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            {/* 如果图片数量超过9张，显示"+N"遮罩 */}
            {index === 8 && imageCount > 9 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <span className="text-white text-2xl font-bold">
                  +{imageCount - 9}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  /**
   * 渲染话题标签
   */
  const renderTopics = () => {
    if (!feed.topics || feed.topics.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {feed.topics.map((topic) => (
          <span
            key={topic.id}
            className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            #{topic.name}
          </span>
        ))}
      </div>
    );
  };

  /**
   * 渲染位置信息
   */
  const renderLocation = () => {
    if (!feed.location) {
      return null;
    }

    return (
      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
        <span>📍</span>
        <span>{feed.location.name}</span>
      </div>
    );
  };

  return (
    <Card className="w-full mb-4" shadow="sm">
      <CardBody className="p-4">
        {/* 用户信息头部 */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex items-center gap-3 flex-1 cursor-pointer"
            onClick={() => onClick?.(feed.id)}
          >
            <Avatar
              src={feed.user.avatar}
              alt={feed.user.nickname}
              size="md"
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {feed.user.nickname}
              </p>
              <p className="text-xs text-gray-500">
                {SSTimeUtil.relative(feed.createdAt)}
              </p>
            </div>
          </div>

          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* 内容文本 */}
        {feed.content && (
          <div
            className="text-gray-800 mb-2 whitespace-pre-wrap cursor-pointer"
            onClick={() => onClick?.(feed.id)}
          >
            {feed.content}
          </div>
        )}

        {/* 话题标签 */}
        {renderTopics()}

        {/* 位置信息 */}
        {renderLocation()}

        {/* 图片网格 */}
        {renderImages()}

        {/* 推荐理由 */}
        {feed.recommendReason && (
          <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
            💡 {feed.recommendReason}
          </div>
        )}
      </CardBody>

      {/* 底部互动栏 */}
      <CardFooter className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-around w-full">
          {/* 点赞 */}
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              feed.isLiked
                ? 'text-red-500 bg-red-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => onLike?.(feed.id, feed.isLiked)}
          >
            <Heart
              size={20}
              fill={feed.isLiked ? 'currentColor' : 'none'}
            />
            <span className="text-sm">
              {feed.likeCount > 0 ? feed.likeCount : '赞'}
            </span>
          </button>

          {/* 评论 */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => onComment?.(feed.id)}
          >
            <MessageCircle size={20} />
            <span className="text-sm">
              {feed.commentCount > 0 ? feed.commentCount : '评论'}
            </span>
          </button>

          {/* 分享 */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => onShare?.(feed.id)}
          >
            <Share2 size={20} />
            <span className="text-sm">
              {feed.shareCount > 0 ? feed.shareCount : '分享'}
            </span>
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};
