import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();
  async findOne(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email, isActive: true } });
  }
}
