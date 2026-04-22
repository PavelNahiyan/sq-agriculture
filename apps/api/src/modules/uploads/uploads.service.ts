import { Injectable, BadRequestException, UnsupportedMediaTypeException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
  private maxFileSize: number;
  private allowedMimeTypes: string[];
  private cloudinaryConfigured: boolean;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.maxFileSize = this.configService.get<number>('MAX_FILE_SIZE', 10485760); // 10MB
    this.allowedMimeTypes = this.configService
      .get<string>('ALLOWED_MIME_TYPES', 'image/jpeg,image/png,image/webp,image/gif,application/pdf')
      .split(',');

    // Configure Cloudinary
    const cloudinaryCloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const cloudinaryApiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const cloudinaryApiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret) {
      cloudinary.config({
        cloud_name: cloudinaryCloudName,
        api_key: cloudinaryApiKey,
        api_secret: cloudinaryApiSecret,
      });
      this.cloudinaryConfigured = true;
    } else {
      this.cloudinaryConfigured = false;
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${this.maxFileSize / 1048576}MB`,
      );
    }

    const mimeType = file.mimetype;
    if (!this.allowedMimeTypes.includes(mimeType)) {
      throw new UnsupportedMediaTypeException(
        `File type ${mimeType} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    entityType?: string,
    entityId?: string,
    uploadedById?: string,
  ): Promise<any> {
    this.validateFile(file);

    let url: string;
    let publicId: string;

    if (this.cloudinaryConfigured) {
      // Upload to Cloudinary
      const result = await this.uploadToCloudinary(file);
      url = result.secure_url;
      publicId = result.public_id;
    } else {
      // Fallback to local storage (for development)
      const result = await this.uploadToLocal(file);
      url = result.url;
      publicId = result.publicId;
    }

    // Save to database
    const upload = await this.prisma.upload.create({
      data: {
        filename: publicId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url,
        entityType,
        entityId,
        uploadedById,
      },
    });

    return upload;
  }

  private async uploadToCloudinary(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'sq-agriculture',
          resource_type: 'auto',
          public_id: `sq-agriculture-${uuidv4()}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  private async uploadToLocal(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    const uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
    const uploadPath = path.resolve(uploadDir);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(uploadPath, filename);

    fs.writeFileSync(filepath, file.buffer);

    const baseUrl = this.configService.get<string>('APP_URL', 'http://localhost:3001');
    const url = `${baseUrl}/uploads/${filename}`;

    return { url, publicId: filename };
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    entityType?: string,
    entityId?: string,
    uploadedById?: string,
  ): Promise<any[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploads = await Promise.all(
      files.map((file) => this.uploadFile(file, entityType, entityId, uploadedById)),
    );

    return uploads;
  }

  async deleteFile(id: string): Promise<void> {
    const upload = await this.prisma.upload.findUnique({
      where: { id },
    });

    if (!upload) {
      throw new BadRequestException('File not found');
    }

    // Delete from Cloudinary if configured
    if (this.cloudinaryConfigured && upload.filename) {
      try {
        await cloudinary.uploader.destroy(upload.filename);
      } catch (error) {
        console.error('Failed to delete from Cloudinary:', error);
      }
    } else {
      // Delete local file
      const uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
      const filepath = path.join(path.resolve(uploadDir), upload.filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    // Delete database record
    await this.prisma.upload.delete({
      where: { id },
    });
  }

  async getFile(id: string): Promise<any> {
    const upload = await this.prisma.upload.findUnique({
      where: { id },
    });

    if (!upload) {
      throw new BadRequestException('File not found');
    }

    return upload;
  }

  async getFilesByEntity(entityType: string, entityId: string): Promise<any[]> {
    return this.prisma.upload.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}