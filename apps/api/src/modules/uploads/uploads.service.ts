import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { CLOUDINARY } from './cloudinary.provider';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class UploadsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CLOUDINARY) private readonly cloudinary: typeof import('cloudinary').v2,
  ) {}

  async getFiles() {
    return this.prisma.upload.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFile(id: string) {
    const upload = await this.prisma.upload.findUnique({
      where: { id },
    });
    if (!upload) {
      throw new NotFoundException('Upload not found');
    }
    return upload;
  }

  async getFilesByEntity(entityType: string, entityId: string) {
    return this.prisma.upload.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteFile(id: string) {
    const upload = await this.getFile(id);
    try {
      const publicId = this.getPublicIdFromUrl(upload.url);
      if (publicId) {
        await this.cloudinary.uploader.destroy(publicId);
      }
    } catch {}
    return this.prisma.upload.delete({
      where: { id },
    });
  }

  async uploadSingle(
    file: Express.Multer.File,
    entityType?: string,
    entityId?: string,
    uploadedById?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'sq-agriculture',
          resource_type: 'auto',
          public_id: `${Date.now()}-${file.originalname.replace(/\.[^.]+$/, '')}`,
        },
        async (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(new BadRequestException(error.message));
          try {
            await this.prisma.upload.create({
              data: {
                filename: result.public_id,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                url: result.secure_url,
                entityType,
                entityId,
                uploadedById,
              },
            });
          } catch {}
          resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    entityType?: string,
    entityId?: string,
    uploadedById?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    const results = [];
    for (const file of files) {
      const result = await this.uploadSingle(file, entityType, entityId, uploadedById);
      results.push(result);
    }
    return results;
  }

  async uploadFromUrl(
    url: string,
    entityType?: string,
    entityId?: string,
    uploadedById?: string,
  ) {
    if (!url) {
      throw new BadRequestException('No URL provided');
    }
    try {
      const result = await this.cloudinary.uploader.upload(url, {
        folder: 'sq-agriculture',
      });
      await this.prisma.upload.create({
        data: {
          filename: result.public_id,
          originalName: url.split('/').pop() || 'image',
          mimeType: result.resource_type,
          size: result.bytes,
          url: result.secure_url,
          entityType,
          entityId,
          uploadedById,
        },
      });
      return result;
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to upload from URL');
    }
  }

  async browseMediaFolder(folder: string) {
    const fs = require('fs');
    const path = require('path');
    const sanitized = folder.replace(/\.\./g, '').replace(/[\\\/]/g, '');
    if (sanitized !== folder) {
      return [];
    }
    const basePath = path.resolve(__dirname, '../../../../web/public');
    const fullPath = path.resolve(basePath, folder);
    if (!fullPath.startsWith(basePath)) {
      return [];
    }
    try {
      const files = fs.readdirSync(fullPath);
      return files
        .filter((file: string) => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
        })
        .map((file: string) => ({
          name: file,
          path: `/${folder}/${file}`,
          fullPath: path.join(folder, file),
        }));
    } catch {
      return [];
    }
  }

  private getPublicIdFromUrl(url: string): string | null {
    const matches = url.match(/\/v\d+\/(.+?)\.(jpg|jpeg|png|gif|webp|svg)$/);
    return matches ? matches[1] : null;
  }
}
