import { type LayoutData, MetaView } from '@rune-ts/server';
import type { HelloWorldPage } from './HelloWorld.page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const HelloWorldRender: RenderHandlerType<typeof HelloWorldPage> = (helloWorldPage) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(helloWorldPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
