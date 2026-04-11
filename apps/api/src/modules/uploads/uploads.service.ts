import { Injectable, BadRequestException, UnsupportedMediaTypeException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
  private uploadDir: string;
  private maxFileSize: number;
  private allowedMimeTypes: string[];

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
    this.maxFileSize = this.configService.get<number>('MAX_FILE_SIZE', 10485760); // 10MB
    this.allowedMimeTypes = this.configService
      .get<string>('ALLOWED_MIME_TYPES', 'image/jpeg,image/png,image/webp,image/gif,application/pdf')
      .split(',');

    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private ensureUploadDir(): void {
    const uploadPath = path.resolve(this.uploadDir);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
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

    // Generate unique filename
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    // Move file to upload directory
    fs.writeFileSync(filepath, file.buffer);

    // Generate URL (in production, this would be S3 URL)
    const baseUrl = this.configService.get<string>('APP_URL', 'http://localhost:3001');
    const url = `${baseUrl}/uploads/${filename}`;

    // Save to database
    const upload = await this.prisma.upload.create({
      data: {
        filename,
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

    // Delete physical file
    const filepath = path.join(this.uploadDir, upload.filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
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
