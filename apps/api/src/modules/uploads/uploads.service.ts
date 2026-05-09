import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma/prisma.service';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

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
    await this.getFile(id);
    return this.prisma.upload.delete({
      where: { id },
    });
  }

  async browseMediaFolder(folder: string) {
    const fs = require('fs');
    const path = require('path');
    
    // Path traversal protection
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
    } catch (error) {
      return [];
    }
  }
}
