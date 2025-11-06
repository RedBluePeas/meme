/**
 * Upload API - 文件上传相关接口
 */

import { upload } from '../request';

/**
 * 上传图片
 */
export function uploadImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string }> {
  return upload<{ url: string }>('/upload/image', file, onProgress);
}

/**
 * 批量上传图片
 */
export async function uploadImages(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<string[]> {
  const uploadPromises = files.map((file, index) =>
    uploadImage(file, (fileProgress) => {
      if (onProgress) {
        const totalProgress = Math.round(
          ((index + fileProgress / 100) / files.length) * 100
        );
        onProgress(totalProgress);
      }
    })
  );

  const results = await Promise.all(uploadPromises);
  return results.map((result) => result.url);
}

/**
 * 上传视频
 */
export function uploadVideo(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; cover: string }> {
  return upload<{ url: string; cover: string }>(
    '/upload/video',
    file,
    onProgress
  );
}

/**
 * 上传文件
 */
export function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; name: string; size: number }> {
  return upload<{ url: string; name: string; size: number }>(
    '/upload/file',
    file,
    onProgress
  );
}
