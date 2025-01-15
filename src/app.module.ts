import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DocumentsModule } from './documents/documents.module';
import { PubSubModule } from './pubsub/pubsub.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (headersRaw: Record<string, unknown>) => {
            const headers = Object.keys(headersRaw).reduce((dest, key) => {
              dest[key.toLowerCase()] = headersRaw[key];
              return dest;
            }, {});

            return {
              req: {
                headers,
              },
            };
          },
        },
      },
    }),
    AuthModule,
    DocumentsModule,
    PubSubModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
