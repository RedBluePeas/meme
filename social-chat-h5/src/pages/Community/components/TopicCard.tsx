/**
 * TopicCard - 话题卡片组件
 */

import React from 'react';
import { Card, CardBody, CardFooter, Image, Button, Chip } from '@nextui-org/react';
import { Users, Eye } from 'lucide-react';
import type { Topic } from '@/types';
import { SSStringUtil } from '@/utils';

interface TopicCardProps {
  topic: Topic;
  onFollow?: (topicId: string, isFollowed: boolean) => void;
  onClick?: (topicId: string) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  onFollow,
  onClick,
}) => {
  return (
    <Card
      className="w-full mb-4"
      shadow="sm"
      isPressable
      onPress={() => onClick?.(topic.id)}
    >
      <CardBody className="p-0">
        {/* 封面图 */}
        {topic.cover && (
          <div className="relative w-full h-40">
            <Image
              src={topic.cover}
              alt={topic.name}
              className="w-full h-full object-cover"
              radius="none"
            />
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* 话题名称 */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white mb-1">
                #{topic.name}
              </h3>
              <p className="text-sm text-white/90 line-clamp-2">
                {topic.description}
              </p>
            </div>
          </div>
        )}

        {/* 无封面时的内容区域 */}
        {!topic.cover && (
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">
              #{topic.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              {topic.description}
            </p>
          </div>
        )}
      </CardBody>

      <CardFooter className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          {/* 统计信息 */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{SSStringUtil.formatNumber(topic.memberCount)} 参与</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>{SSStringUtil.formatNumber(topic.viewCount)} 浏览</span>
            </div>
          </div>

          {/* 关注按钮 */}
          <Button
            size="sm"
            color={topic.isFollowed ? 'default' : 'primary'}
            variant={topic.isFollowed ? 'bordered' : 'solid'}
            onClick={(e) => {
              e.stopPropagation();
              onFollow?.(topic.id, topic.isFollowed);
            }}
          >
            {topic.isFollowed ? '已关注' : '关注'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
