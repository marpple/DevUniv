import { type LayoutData, MetaView } from '@rune-ts/server';
import type { ObjectFe2Page } from './ObjectFe2Page';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const objectFe2RenderHandler: RenderHandlerType<typeof ObjectFe2Page> = (
  createObjectFePage,
) => {
  return (req, res, next) => {
    const layoutData: LayoutData = {
      ...res.locals.layoutData,
      html: {
        ...res.locals.layoutData.html,
        class: 'object-fe',
      },
    };

    res.send(new MetaView(createObjectFePage({}, { is_mobile: false }), layoutData).toHtml());
  };
};
