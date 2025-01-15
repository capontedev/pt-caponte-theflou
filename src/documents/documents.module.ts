import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsResolver } from './documents.resolver';
import { PubSubModule } from './../pubsub/pubsub.module';
import { UsersModule } from './../users/users.module';

@Module({
  imports: [PubSubModule, UsersModule],
  providers: [DocumentsResolver, DocumentsService],
})
export class DocumentsModule {}
