import { type LayoutData, MetaView } from '@rune-ts/server';
import type { IterableAndAsyncPage } from './IterableAndAsync.page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const IterableAndAsyncRender: RenderHandlerType<typeof IterableAndAsyncPage> = (
  iterableAndAsyncPage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(iterableAndAsyncPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
