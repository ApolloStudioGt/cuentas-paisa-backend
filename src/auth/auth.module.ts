import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from './user/user.module';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { FirebaseAdmin } from '../config/firebase.setup';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    FirebaseAdmin,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
  imports: [UserModule],
})
export class AuthModule {}
