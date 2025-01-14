import {
  Resolver,
  Query,
  Mutation,
  Args,
  Subscription,
  Int,
} from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { PubSubService } from 'src/pubsub/pubSub.service';
import { UsersService } from 'src/users/users.service';

const triggerName = 'documentUpdates';

@Resolver(() => Document)
export class DocumentsResolver {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly pubSubService: PubSubService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => Document)
  async updateDocument(
    @Args('documentId', { type: () => Int }) documentId: number,
  ) {
    await this.pubSubService.publish(triggerName, {
      [triggerName]: {
        documentId,
      },
    });
    return this.documentsService.update(documentId);
  }

  @Subscription(() => Document, {
    async filter(this: DocumentsResolver, payload, variables) {
      return (
        this.usersService.hasDocumentUpdates(1, variables.documentId) &&
        payload[triggerName].documentId === variables.documentId
      );
    },
  })
  documentUpdates(@Args('documentId', { type: () => Int }) documentId: number) {
    this.usersService.setDocumentUpdates(1, documentId);
    return this.pubSubService.asyncIterableIterator(triggerName);
  }
}
