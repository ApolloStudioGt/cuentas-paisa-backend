import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingUpDto } from './dto/singUp.dto';
import { UserService } from './user/user.service';
import { SignInDto } from './dto/singIn.dto';
import { PublicApi } from '../common/decorators/public-api.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('user')
  async findAll() {
    return this.userService.findAll();
  }

  @Get('user/:email')
  async find(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @PublicApi()
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto);
  }

  @PublicApi()
  @Post('singup')
  async create(@Body() singUpDto: SingUpDto) {
    return this.authService.create(singUpDto);
  }
}
