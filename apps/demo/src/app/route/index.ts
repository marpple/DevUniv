import { createRouter } from '@rune-ts/server';
import { HelloWorldRoute } from '../../pages/HelloWorld/HelloWorld.route';

type RouterType = typeof HelloWorldRoute;

export const ClientRouter = createRouter<RouterType>({
  ...HelloWorldRoute,
});
