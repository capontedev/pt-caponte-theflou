import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubSubService {
  constructor(@Inject('PUB_SUB') private readonly pubSub: PubSub) {}

  publish(triggerName: string, payload: any) {
    return this.pubSub.publish(triggerName, {
      [triggerName]: payload,
    });
  }

  asyncIterableIterator(triggers: string | readonly string[]) {
    return this.pubSub.asyncIterableIterator(triggers);
  }
}
