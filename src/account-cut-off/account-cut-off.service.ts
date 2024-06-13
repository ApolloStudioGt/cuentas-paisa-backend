import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountCutOffService {
  findAll() {
    return `This action returns all accountCutOff`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accountCutOff`;
  }
}
