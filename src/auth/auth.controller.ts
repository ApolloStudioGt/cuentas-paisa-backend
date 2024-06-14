import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingUpDto } from './dto/singUp.dto';
import { UserService } from './user/user.service';
import { SignInDto } from './dto/singIn.dto';
import { Public } from 'src/common/decorators/public-api.decorator';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('user/:email')
  async find(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @Get('user')
  async findAll() {
    return this.userService.findAll();
  }

  @Post('singup')
  async create(@Body() singUpDto: SingUpDto) {
    return this.authService.create(singUpDto);
  }

  @Public()
  @Post('singin')
  async login(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto);
  }
}
