import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@/common/constants';

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('single')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        entityType: { type: 'string' },
        entityId: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Body('entityType') entityType?: string,
    @Body('entityId') entityId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.uploadsService.uploadFile(
      file,
      entityType,
      entityId,
      user?.id,
    );
  }

  @Post('multiple')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        entityType: { type: 'string' },
        entityId: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Files uploaded successfully' })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('entityType') entityType?: string,
    @Body('entityId') entityId?: string,
    @CurrentUser() user?: any,
  ) {
    return this.uploadsService.uploadMultiple(
      files,
      entityType,
      entityId,
      user?.id,
    );
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all uploads (Admin only)' })
  @ApiResponse({ status: 200, description: 'Uploads retrieved' })
  async findAll(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
  ) {
    if (entityType && entityId) {
      return this.uploadsService.getFilesByEntity(entityType, entityId);
    }
    return this.uploadsService.getFile.bind(this.uploadsService);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get upload by ID' })
  @ApiResponse({ status: 200, description: 'Upload retrieved' })
  async findOne(@Param('id') id: string) {
    return this.uploadsService.getFile(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete upload (Admin only)' })
  @ApiResponse({ status: 200, description: 'Upload deleted' })
  async remove(@Param('id') id: string) {
    await this.uploadsService.deleteFile(id);
    return { message: 'File deleted successfully' };
  }
}
