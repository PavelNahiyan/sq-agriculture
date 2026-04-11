import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '@/prisma/prisma/prisma.service';
import { RoleType } from '@/common/constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Call parent canActivate (validates JWT)
    const result = await super.canActivate(context);
    if (!result) {
      return false;
    }

    // Check roles if specified
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles && requiredRoles.length > 0) {
      const request = context.switchToHttp().getRequest();
      const userId = request.user?.id;

      if (userId) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user || !user.isActive || !(requiredRoles as string[]).includes(user.role)) {
          throw new UnauthorizedException('Insufficient permissions');
        }
      }
    }

    return true;
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    return user;
  }
}
