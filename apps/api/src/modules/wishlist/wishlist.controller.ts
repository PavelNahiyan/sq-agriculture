import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('wishlist')
@Controller('wishlist')
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist items retrieved' })
  async findAll(@CurrentUser() user: User): Promise<{ id: string; productId: string; product: { id: string; name: string; price: number; image?: string } }[]> {
    return this.wishlistService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiResponse({ status: 201, description: 'Product added to wishlist' })
  async add(@CurrentUser() user: User, @Body() dto: AddToWishlistDto): Promise<{ message: string }> {
    return this.wishlistService.add(user.id, dto.productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiResponse({ status: 200, description: 'Product removed from wishlist' })
  async remove(@CurrentUser() user: User, @Param('productId') productId: string): Promise<{ message: string }> {
    return this.wishlistService.remove(user.id, productId);
  }
}
