import { createRouter } from '@rune-ts/server';
import { ConcurrentRoute } from '../../pages/live-1/concurrentRoute';
import { MplRoute } from '../../pages/live-2/MplRoute';
import { ObjectFeRoute } from '../../pages/live-3/ObjectFeRoute';

type RouterType = typeof ConcurrentRoute & typeof MplRoute & typeof ObjectFeRoute;

export const ClientRouter = createRouter<RouterType>({
  ...ConcurrentRoute,
  ...MplRoute,
  ...ObjectFeRoute,
});
