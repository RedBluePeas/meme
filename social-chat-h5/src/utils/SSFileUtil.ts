/**
 * 文件工具类 (Social chat Service DocumentIcon Util)
 * 处理文件上传、图片压缩、文件读取等操作
 */

import { SSStringUtil } from './SSStringUtil';
import { SSDictUtil } from './SSDictUtil';

/**
 * 图片压缩选项
 */
interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

export class SSFileUtil {
  /**
   * 选择文件
   * @param accept - 接受的文件类型
   * @param multiple - 是否支持多选
   * @returns Promise<FileList>
   *
   * @example
   * const files = await SSFileUtil.selectFile('image/*', true);
   */
  static selectFile(accept = '*', multiple = false): Promise<FileList | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.multiple = multiple;

      input.onchange = () => {
        resolve(input.files);
      };

      input.click();
    });
  }

  /**
   * 选择图片
   * @param multiple - 是否支持多选
   * @returns Promise<FileList>
   */
  static selectImage(multiple = false): Promise<FileList | null> {
    return this.selectFile('image/*', multiple);
  }

  /**
   * 选择视频
   * @param multiple - 是否支持多选
   * @returns Promise<FileList>
   */
  static selectVideo(multiple = false): Promise<FileList | null> {
    return this.selectFile('video/*', multiple);
  }

  /**
   * 文件转Base64
   * @param file - 文件对象
   * @returns Promise<string> - Base64字符串
   *
   * @example
   * const base64 = await SSFileUtil.fileToBase64(file);
   */
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Base64转Blob
   * @param base64 - Base64字符串
   * @param mimeType - MIME类型
   * @returns Blob对象
   */
  static base64ToBlob(base64: string, mimeType = 'image/png'): Blob {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeType });
  }

  /**
   * Blob转File
   * @param blob - Blob对象
   * @param filename - 文件名
   * @returns File对象
   */
  static blobToFile(blob: Blob, filename: string): File {
    return new File([blob], filename, { type: blob.type });
  }

  /**
   * 压缩图片
   * @param file - 图片文件
   * @param options - 压缩选项
   * @returns Promise<File> - 压缩后的文件
   *
   * @example
   * const compressed = await SSFileUtil.compressImage(file, {
   *   maxWidth: 1920,
   *   maxHeight: 1080,
   *   quality: 0.8
   * });
   */
  static compressImage(file: File, options: CompressOptions = {}): Promise<File> {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.8, mimeType = 'image/jpeg' } = options;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // 计算压缩后的尺寸
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = this.blobToFile(blob, file.name);
                resolve(compressedFile);
              } else {
                reject(new Error('压缩失败'));
              }
            },
            mimeType,
            quality
          );
        };

        img.onerror = () => reject(new Error('图片加载失败'));
      };

      reader.onerror = () => reject(new Error('文件读取失败'));
    });
  }

  /**
   * 批量压缩图片
   * @param files - 图片文件数组
   * @param options - 压缩选项
   * @returns Promise<File[]> - 压缩后的文件数组
   */
  static async compressImages(files: File[], options: CompressOptions = {}): Promise<File[]> {
    const promises = files.map((file) => this.compressImage(file, options));
    return Promise.all(promises);
  }

  /**
   * 获取图片尺寸
   * @param file - 图片文件
   * @returns Promise<{ width: number, height: number }>
   *
   * @example
   * const { width, height } = await SSFileUtil.getImageSize(file);
   */
  static getImageSize(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;

        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => reject(new Error('图片加载失败'));
      };

      reader.onerror = () => reject(new Error('文件读取失败'));
    });
  }

  /**
   * 获取视频时长
   * @param file - 视频文件
   * @returns Promise<number> - 时长（秒）
   */
  static getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => reject(new Error('视频加载失败'));

      video.src = URL.createObjectURL(file);
    });
  }

  /**
   * 获取视频封面
   * @param file - 视频文件
   * @param time - 截取时间（秒）
   * @returns Promise<string> - Base64图片
   */
  static getVideoCover(file: File, time = 0): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.currentTime = time;

      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        const coverBase64 = canvas.toDataURL('image/jpeg');
        window.URL.revokeObjectURL(video.src);
        resolve(coverBase64);
      };

      video.onerror = () => reject(new Error('视频加载失败'));

      video.src = URL.createObjectURL(file);
    });
  }

  /**
   * 下载文件
   * @param url - 文件URL
   * @param filename - 文件名
   *
   * @example
   * SSFileUtil.download('https://example.com/file.pdf', '文档.pdf');
   */
  static download(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  }

  /**
   * 下载Blob为文件
   * @param blob - Blob对象
   * @param filename - 文件名
   */
  static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    this.download(url, filename);
    URL.revokeObjectURL(url);
  }

  /**
   * 下载Base64为文件
   * @param base64 - Base64字符串
   * @param filename - 文件名
   * @param mimeType - MIME类型
   */
  static downloadBase64(base64: string, filename: string, mimeType = 'image/png'): void {
    const blob = this.base64ToBlob(base64, mimeType);
    this.downloadBlob(blob, filename);
  }

  /**
   * 格式化文件大小
   * @param bytes - 字节数
   * @returns 格式化后的大小字符串
   *
   * @example
   * SSFileUtil.formatSize(1024) // '1.00 KB'
   */
  static formatSize(bytes: number): string {
    return SSStringUtil.formatFileSize(bytes);
  }

  /**
   * 获取文件扩展名
   * @param filename - 文件名
   * @returns 扩展名（小写，包含点）
   *
   * @example
   * SSFileUtil.getExtension('photo.JPG') // '.jpg'
   */
  static getExtension(filename: string): string {
    const ext = filename.split('.').pop();
    return ext ? '.' + ext.toLowerCase() : '';
  }

  /**
   * 获取文件名（不包含扩展名）
   * @param filename - 完整文件名
   * @returns 文件名
   *
   * @example
   * SSFileUtil.getFileName('photo.jpg') // 'photo'
   */
  static getFileName(filename: string): string {
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
  }

  /**
   * 判断是否是图片文件
   * @param file - 文件对象或文件名
   * @returns 是否是图片
   */
  static isImage(file: File | string): boolean {
    if (typeof file === 'string') {
      const ext = this.getExtension(file);
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(ext);
    }
    return file.type.startsWith('image/');
  }

  /**
   * 判断是否是视频文件
   * @param file - 文件对象或文件名
   * @returns 是否是视频
   */
  static isVideo(file: File | string): boolean {
    if (typeof file === 'string') {
      const ext = this.getExtension(file);
      return ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv'].includes(ext);
    }
    return file.type.startsWith('video/');
  }

  /**
   * 判断是否是音频文件
   * @param file - 文件对象或文件名
   * @returns 是否是音频
   */
  static isAudio(file: File | string): boolean {
    if (typeof file === 'string') {
      const ext = this.getExtension(file);
      return ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'].includes(ext);
    }
    return file.type.startsWith('audio/');
  }

  /**
   * 获取文件类型
   * @param filename - 文件名
   * @returns 文件类型信息
   */
  static getFileType(filename: string) {
    return SSDictUtil.getFileType(filename);
  }

  /**
   * FileList转数组
   * @param fileList - FileList对象
   * @returns File数组
   */
  static fileListToArray(fileList: FileList | null): File[] {
    if (!fileList) return [];
    return Array.from(fileList);
  }

  /**
   * 复制文件到剪贴板（仅支持图片）
   * @param file - 文件对象
   * @returns Promise<boolean>
   */
  static async copyToClipboard(file: File): Promise<boolean> {
    try {
      if (!this.isImage(file)) {
        console.warn('Only image files can be copied to clipboard');
        return false;
      }

      const item = new ClipboardItem({ [file.type]: file });
      await navigator.clipboard.write([item]);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
}
