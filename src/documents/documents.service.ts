import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  update(documentId: number) {
    return {
      documentId,
    };
  }
}
