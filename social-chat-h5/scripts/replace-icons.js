#!/usr/bin/env node
/**
 * 图标替换脚本
 * Lucide React → Heroicons
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Lucide 到 Heroicons 的映射关系
const iconMapping = {
  'Heart': 'HeartIcon',
  'MessageCircle': 'ChatBubbleLeftIcon',
  'Share2': 'ShareIcon',
  'MoreVertical': 'EllipsisVerticalIcon',
  'Users': 'UsersIcon',
  'Eye': 'EyeIcon',
  'EyeOff': 'EyeSlashIcon',
  'Plus': 'PlusIcon',
  'Search': 'MagnifyingGlassIcon',
  'X': 'XMarkIcon',
  'Camera': 'CameraIcon',
  'Pin': 'MapPinIcon',
  'BellOff': 'BellSlashIcon',
  'Image': 'PhotoIcon',
  'Video': 'VideoCameraIcon',
  'File': 'DocumentIcon',
  'Trash2': 'TrashIcon',
  'MapPin': 'MapPinIcon',
  'Hash': 'HashtagIcon',
  'Lock': 'LockClosedIcon',
  'Bell': 'BellIcon',
  'Send': 'PaperAirplaneIcon',
  'Smile': 'FaceSmileIcon',
  'ChevronRight': 'ChevronRightIcon',
  'Phone': 'PhoneIcon',
  'Check': 'CheckIcon',
  'CheckCheck': 'CheckIcon', // 注意：CheckCheck 用单个 CheckIcon 代替
  'Clock': 'ClockIcon',
  'XCircle': 'XCircleIcon',
  'UserPlus': 'UserPlusIcon',
  'Edit': 'PencilIcon',
  'QrCode': 'QrCodeIcon',
  'SearchIcon': 'MagnifyingGlassIcon',
  'ImageIcon': 'PhotoIcon',
};

console.log('🔄 开始替换图标导入...\n');

// 1. 替换所有 lucide-react 导入为 @heroicons/react/24/outline
execSync(
  `find src -type f \\( -name "*.tsx" -o -name "*.ts" \\) -exec sed -i "s/from 'lucide-react'/from '@heroicons\\/react\\/24\\/outline'/g" {} +`,
  { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' }
);

execSync(
  `find src -type f \\( -name "*.tsx" -o -name "*.ts" \\) -exec sed -i 's/from "lucide-react"/from "@heroicons\\/react\\/24\\/outline"/g' {} +`,
  { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' }
);

console.log('✅ 步骤 1: 导入路径替换完成\n');

// 2. 替换图标名称
console.log('🔄 开始替换图标名称...\n');

Object.entries(iconMapping).forEach(([lucideIcon, heroIcon]) => {
  try {
    // 替换 import 语句中的图标名
    execSync(
      `find src -type f \\( -name "*.tsx" -o -name "*.ts" \\) -exec sed -i "s/\\b${lucideIcon}\\b/${heroIcon}/g" {} +`,
      { cwd: path.resolve(__dirname, '..') }
    );
    console.log(`  ✓ ${lucideIcon} → ${heroIcon}`);
  } catch (error) {
    console.error(`  ✗ ${lucideIcon} 替换失败`);
  }
});

console.log('\n✅ 步骤 2: 图标名称替换完成\n');

// 3. 特殊处理：为所有 Heroicons 添加 className="w-5 h-5" (如果没有设置尺寸)
console.log('🔄 调整图标尺寸...\n');
console.log('  (手动调整，因为需要根据上下文判断)\n');

console.log('✨ 图标替换完成！\n');
console.log('📝 请注意：');
console.log('  1. Heroicons 图标组件名称以 "Icon" 结尾');
console.log('  2. 需要手动为图标添加 className="w-5 h-5" 等尺寸样式');
console.log('  3. CheckCheck 已替换为单个 CheckIcon，可能需要调整显示逻辑');
console.log('  4. 请检查编译错误并手动修复特殊情况\n');
