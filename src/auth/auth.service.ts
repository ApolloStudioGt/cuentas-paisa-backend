import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { v4 as uuid } from 'uuid';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { SingUpDto } from './dto/singUp.dto';
import { SignInDto } from './dto/singIn.dto';
import { FirebaseAdmin } from '../config/firebase.setup';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly admin: FirebaseAdmin,
  ) {}

  async create(singUpDto: SingUpDto): Promise<UserRecord> {
    const { email, password, fullName } = singUpDto;
    const app = this.admin.setup();

    try {
      const userUuid = uuid();
      const createdUser = await app.auth().createUser({
        email,
        password,
        displayName: fullName,
        uid: userUuid,
      });
      await app.auth().setCustomUserClaims(createdUser.uid, { Role: 'seller' });
      await this.usersService.create({ email, fullName, id: userUuid });
      return createdUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(signInDto: SignInDto) {
    try {
      const auth = getAuth();
      const { email, password } = signInDto;

      return await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential: UserCredential) => {
          return userCredential;
        })
        .catch((error) => {
          throw new BadRequestException(error.message);
        });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyToken(token: string) {
    try {
      const app = this.admin.setup();
      return await app
        .auth()
        .verifyIdToken(token)
        .then(() => {
          return true;
        })
        .catch((error) => {
          throw new BadRequestException(error.message);
        });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async decodeUserByToken(token: string) {
    try {
      const app = this.admin.setup();
      return await app
        .auth()
        .verifyIdToken(token)
        .then((decodeToken) => {
          return decodeToken;
        })
        .catch((error) => {
          throw new BadRequestException(error.message);
        });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
