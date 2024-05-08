import { createRouter } from '@rune-ts/server';
import { ConcurrentRoute } from '../../pages/live-1/concurrentRoute';
import { MplRoute } from '../../pages/live-2/MplRoute';

type RouterType = typeof ConcurrentRoute & typeof MplRoute;

export const ClientRouter = createRouter<RouterType>({
  ...ConcurrentRoute,
  ...MplRoute,
});
