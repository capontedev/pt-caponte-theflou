import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsResolver } from './documents.resolver';
import { DocumentsService } from './documents.service';
import { PubSubService } from './../pubsub/pubsub.service';
import { UsersService } from './../users/users.service';

describe('DocumentsResolver', () => {
  let resolver: DocumentsResolver;
  let documentsService: DocumentsService;
  let pubSubService: PubSubService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsResolver,
        {
          provide: DocumentsService,
          useValue: {
            update: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: PubSubService,
          useValue: {
            publish: jest.fn(),
            asyncIterableIterator: jest.fn().mockReturnValue({
              [Symbol.asyncIterator]() {
                return {
                  next: jest.fn().mockResolvedValue({ done: false, value: {} }),
                };
              },
            }),
          },
        },
        {
          provide: UsersService,
          useValue: {
            hasDocumentUpdates: jest.fn().mockResolvedValue(true),
            setDocumentUpdates: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<DocumentsResolver>(DocumentsResolver);
    documentsService = module.get<DocumentsService>(DocumentsService);
    pubSubService = module.get<PubSubService>(PubSubService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('updateDocument', () => {
    it('should call pubSubService.publish and documentsService.update', async () => {
      await resolver.updateDocument(1);
      expect(pubSubService.publish).toHaveBeenCalledWith('documentUpdates', {
        documentId: 1,
      });
      expect(documentsService.update).toHaveBeenCalledWith(1);
    });
  });

  describe('documentUpdates', () => {
    it('should set document updates and return an async iterable iterator', () => {
      const context = { req: { user: { id: 1 } } };
      const result = resolver.documentUpdates(1, context);
      expect(usersService.setDocumentUpdates).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(
        pubSubService.asyncIterableIterator('documentUpdates'),
      );
    });
  });
});
