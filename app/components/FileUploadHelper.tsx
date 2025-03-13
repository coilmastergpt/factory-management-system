'use client';

import { useState } from 'react';
import { useToast } from '@chakra-ui/react';

// 파일 업로드 결과 타입
export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

// 파일 업로드 훅 반환 타입
interface UseFileUploadReturn {
  uploading: boolean;
  uploadFiles: (files: FileList) => Promise<UploadedFile[]>;
  compressImage: (file: File, maxWidth?: number, maxHeight?: number, quality?: number) => Promise<File>;
  formatFileSize: (bytes: number) => string;
}

/**
 * 파일 업로드 및 이미지 압축을 위한 커스텀 훅
 */
export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  /**
   * 파일 업로드 및 최적화 함수
   * @param files 업로드할 파일 목록
   * @returns 업로드된 파일 정보 배열
   */
  const uploadFiles = async (files: FileList): Promise<UploadedFile[]> => {
    if (!files || files.length === 0) return [];
    
    setUploading(true);
    const uploadedFiles: UploadedFile[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 파일 크기 제한 (이미지: 10MB, 동영상: 100MB)
        const maxSize = file.type.startsWith('image/') ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
        if (file.size > maxSize) {
          toast({
            title: '파일 크기 초과',
            description: `${file.name}의 크기가 너무 큽니다. ${file.type.startsWith('image/') ? '이미지는 10MB' : '동영상은 100MB'} 이하여야 합니다.`,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          continue;
        }
        
        // 파일 형식 검사
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          toast({
            title: '지원하지 않는 파일 형식',
            description: '이미지 또는 동영상 파일만 업로드할 수 있습니다.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          continue;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('파일 업로드에 실패했습니다.');
        }
        
        const data = await response.json();
        
        if (data.success) {
          uploadedFiles.push({
            url: data.file.url,
            name: data.file.name,
            size: data.file.size,
            type: data.file.type
          });
          
          toast({
            title: '파일 업로드 성공',
            description: `${data.file.name} 파일이 업로드되었습니다.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
      }
      
      return uploadedFiles;
    } catch (error) {
      console.error('파일 업로드 오류:', error);
      toast({
        title: '파일 업로드 실패',
        description: '파일 업로드 중 오류가 발생했습니다.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  /**
   * 이미지 압축 함수 (클라이언트 측)
   * @param file 압축할 이미지 파일
   * @param maxWidth 최대 너비
   * @param maxHeight 최대 높이
   * @param quality 품질 (0-1)
   * @returns 압축된 이미지 파일
   */
  const compressImage = async (
    file: File,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          // 이미지 크기 계산
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
          
          // Canvas에 이미지 그리기
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // 압축된 이미지 생성
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas to Blob conversion failed'));
                return;
              }
              
              // 새 파일 생성
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return {
    uploading,
    uploadFiles,
    compressImage,
    formatFileSize
  };
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형태로 변환
 * @param bytes 파일 크기 (바이트)
 * @returns 포맷된 파일 크기 문자열 (예: "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 파일 타입에 따른 아이콘 이름 반환
 * @param fileType 파일 MIME 타입
 * @returns 아이콘 이름
 */
export const getFileIcon = (fileType: string): string => {
  if (fileType.startsWith('image/')) {
    return 'image';
  } else if (fileType.startsWith('video/')) {
    return 'video';
  } else if (fileType.startsWith('audio/')) {
    return 'audio';
  } else if (fileType.includes('pdf')) {
    return 'pdf';
  } else if (fileType.includes('word') || fileType.includes('document')) {
    return 'document';
  } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
    return 'spreadsheet';
  } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
    return 'presentation';
  } else {
    return 'file';
  }
}; 