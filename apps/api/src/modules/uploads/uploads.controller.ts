import { Get, Delete, Controller, Query, Param, NotFoundException } from '@nestjs/common';
import { UploadsService } from './uploads.service';

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

  @Get('media/browse')
  async browseMedia(
    @Query('folder') folder: string = 'images',
  ) {
    return this.uploadsService.browseMediaFolder(folder);
  }
}
