import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserIdGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const endpoint = context.switchToHttp().getRequest().url.toLowerCase();
    const httpMethod = context.switchToHttp().getRequest().method;
    const validEndpoint = !(httpMethod === 'POST' && endpoint === '/api/sale');
    if (isPublic || validEndpoint) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token faltante');
    }

    try {
      const user = await this.authService.decodeUserByToken(token);
      request.user = user;

      if (request.user && request.body) {
        request.body.userId = request.user.uid;
      }

      return true;
    } catch (exception) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
