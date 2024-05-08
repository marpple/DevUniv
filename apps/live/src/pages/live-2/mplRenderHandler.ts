import { type LayoutData, MetaView } from '@rune-ts/server';
import type { MplPage } from './MplPage';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const mplRenderHandler: RenderHandlerType<typeof MplPage> = (createMplPage) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
    };

    res.send(new MetaView(createMplPage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
