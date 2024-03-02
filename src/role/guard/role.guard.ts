import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../role.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const jwtToken = request.cookies?.jwt;

    if (!jwtToken) {
      return false;
    }

    try {
      const decodedToken = this.jwtService.verify(jwtToken);
      const userRole: Role = decodedToken.role;
      return requiredRoles.includes(userRole);
    } catch (error) {
      console.error('Error validating JWT token:', error);
      return false;
    }
  }
}
