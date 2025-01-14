import { Injectable } from '@nestjs/common';
import { USERS } from './users.mock';

@Injectable()
export class UsersService {
  private _users = [...USERS];

  hasDocumentUpdates(userId: number, documentId: number) {
    return this._users.some(
      (user) =>
        user.id === userId &&
        user.documentsId.some((document) => document === documentId),
    );
  }

  setDocumentUpdates(userId: number, documentId: number) {
    const user = this._users.find((user) => user.id === userId);

    if (user) {
      user.documentsId = [...new Set([documentId, ...user.documentsId])];
    }
  }
}
