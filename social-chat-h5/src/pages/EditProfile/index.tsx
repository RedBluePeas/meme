/**
 * EditProfile - 编辑资料页面
 * 编辑昵称、签名、头像等个人信息
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Textarea, Button, Avatar } from '@nextui-org/react';
import { Camera } from 'lucide-react';
import { MainLayout } from '@/components/Layout';
import { useAppSelector, useAppDispatch } from '@/store';
import { updateUserAsync } from '@/store/slices/userSlice';
import { uploadApi } from '@/services/api';
import { SSDialog } from '@/components/SSDialog';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const [nickname, setNickname] = useState(user?.nickname || '');
  const [signature, setSignature] = useState(user?.signature || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
      setSignature(user.signature || '');
      setAvatar(user.avatar);
    }
  }, [user]);

  /**
   * 上传头像
   */
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      SSDialog.toast.error('图片大小不能超过 5MB');
      return;
    }

    setUploading(true);
    const loading = SSDialog.loading('上传中...');

    try {
      const urls = await uploadApi.uploadImages([file]);
      setAvatar(urls[0]);
      loading.close();
      SSDialog.toast.success('上传成功');
    } catch (error) {
      loading.close();
      SSDialog.toast.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  /**
   * 保存资料
   */
  const handleSave = async () => {
    if (!nickname.trim()) {
      SSDialog.toast.error('昵称不能为空');
      return;
    }

    setSaving(true);

    try {
      await dispatch(
        updateUserAsync({
          nickname: nickname.trim(),
          signature: signature.trim(),
          avatar,
        })
      ).unwrap();

      SSDialog.toast.success('保存成功');
      navigate(-1);
    } catch (error) {
      SSDialog.toast.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout
      showTabBar={false}
      showNavBar={true}
      navBarProps={{
        title: '编辑资料',
        showBack: true,
        onBack: () => navigate(-1),
        rightContent: (
          <Button
            size="sm"
            color="primary"
            onClick={handleSave}
            isLoading={saving}
          >
            保存
          </Button>
        ),
      }}
    >
      <div className="min-h-screen bg-gray-50 p-4">
        {/* 头像 */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">头像</span>
            <div className="relative">
              <Avatar src={avatar} size="lg" className="cursor-pointer" />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer"
              >
                <Camera size={14} className="text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </div>
          </div>
        </div>

        {/* 昵称 */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <Input
            label="昵称"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            description={`${nickname.length}/20`}
          />
        </div>

        {/* 签名 */}
        <div className="bg-white rounded-lg p-4">
          <Textarea
            label="个性签名"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            maxLength={50}
            minRows={3}
            description={`${signature.length}/50`}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default EditProfilePage;
