import {
  Resolver,
  Query,
  Mutation,
  Args,
  Subscription,
  Int,
  Context,
} from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { PubSubService } from './../pubsub/pubsub.service';
import { UsersService } from './../users/users.service';
import { UseGuards } from '@nestjs/common';
import { GqlBasicAuthGuard } from './../auth/basic-auth.guard';

const triggerName = 'documentUpdates';

interface DocumentContext {
  req: { user: { id: number } };
}

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
    await this.pubSubService.publish(triggerName, { documentId });
    return this.documentsService.update(documentId);
  }

  @Subscription(() => Document, {
    async filter(
      this: DocumentsResolver,
      payload,
      variables,
      context: DocumentContext,
    ) {
      return (
        this.usersService.hasDocumentUpdates(
          context.req.user.id,
          variables.documentId,
        ) && payload[triggerName].documentId === variables.documentId
      );
    },
  })
  @UseGuards(GqlBasicAuthGuard)
  documentUpdates(
    @Args('documentId', { type: () => Int }) documentId: number,
    @Context() context: DocumentContext,
  ) {
    this.usersService.setDocumentUpdates(context.req.user.id, documentId);
    return this.pubSubService.asyncIterableIterator(triggerName);
  }
}
