import { createRouter } from '@rune-ts/server';
import { IterableAndAsyncRoute } from '../../pages/live-1/IterableAndAsync.route';

type RouterType = typeof IterableAndAsyncRoute;

export const ClientRouter = createRouter<RouterType>({
  ...IterableAndAsyncRoute,
});
