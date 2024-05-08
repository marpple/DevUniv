import { type LayoutData, MetaView } from '@rune-ts/server';
import type { ConcurrentPage } from './ConcurrentPage';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const concurrentRenderHandler: RenderHandlerType<typeof ConcurrentPage> = (
  createCurrentPage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createCurrentPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
