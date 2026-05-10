import {
  Get, Delete, Post, Controller, Query, Param, Body,
  NotFoundException, UseInterceptors, UploadedFile,
  UploadedFiles, Req,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { Request } from 'express';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  async findAll(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
  ) {
    if (entityType && entityId) {
      return this.uploadsService.getFilesByEntity(entityType, entityId);
    }
    return this.uploadsService.getFiles();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.uploadsService.getFile(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.uploadsService.deleteFile(id);
    return { message: 'File deleted successfully' };
  }

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Body('entityType') entityType?: string,
    @Body('entityId') entityId?: string,
    @Req() req?: Request,
  ) {
    const result = await this.uploadsService.uploadSingle(
      file,
      entityType,
      entityId,
      (req as any).user?.id,
    );
    return { url: result.secure_url, filename: result.public_id };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('entityType') entityType?: string,
    @Body('entityId') entityId?: string,
    @Req() req?: Request,
  ) {
    const results = await this.uploadsService.uploadMultiple(
      files,
      entityType,
      entityId,
      (req as any).user?.id,
    );
    return results.map((r) => ({ url: r.secure_url, filename: r.public_id }));
  }

  @Post('from-url')
  async uploadFromUrl(
    @Body('url') url: string,
    @Body('entityType') entityType?: string,
    @Body('entityId') entityId?: string,
    @Req() req?: Request,
  ) {
    const result = await this.uploadsService.uploadFromUrl(
      url,
      entityType,
      entityId,
      (req as any).user?.id,
    );
    return { url: result.secure_url, filename: result.public_id };
  }

  @Get('media/browse')
  async browseMedia(@Query('folder') folder: string = 'images') {
    return this.uploadsService.browseMediaFolder(folder);
  }
}
