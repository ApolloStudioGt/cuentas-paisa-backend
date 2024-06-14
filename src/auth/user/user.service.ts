import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async findOne(email: string): Promise<User> {
    const user: User = await this.prismaService.user.findUnique({
      where: { email, isActive: true },
    });

    if (user) {
      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany({
      where: { isActive: true },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }
}
