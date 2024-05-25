import { type LayoutData, MetaView } from '@rune-ts/server';
import type { ObjectFePage } from './ObjectFePage';
import type { RenderHandlerType } from '../../../../../packages/types/renderHandlerType';

export const objectFeRenderHandler: RenderHandlerType<typeof ObjectFePage> = (
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
