import { app } from '@rune-ts/server';
import type { LayoutData } from '@rune-ts/server';
import UAParser from 'ua-parser-js';
import favicon from '../../../public/favicon.png';
import { ClientRouter } from '../route';
import { concurrentRenderHandler } from '../../pages/live-1/concurrentRenderHandler';
import { mplRenderHandler } from '../../pages/live-2/mplRenderHandler';
import { objectFeRenderHandler } from '../../pages/live-3/objectFeRenderHandler';

const server = app();
server.use((req, res, next) => {
  const ua_string = req.headers['user-agent'];
  const parser = new UAParser(ua_string);
  res.locals.is_mobile = !!parser.getDevice().type;

  res.locals.layoutData = {
    html: {
      is_mobile: res.locals.is_mobile,
    },
    head: {
      title: '',
      description: '',
      link_tags: [
        {
          rel: 'icon',
          href: favicon,
          type: 'image/png',
        },
      ],
    },
  } as LayoutData;

  return next();
});

server.get(
  ClientRouter['/concurrent'].toString(),
  concurrentRenderHandler(ClientRouter['/concurrent']),
);

server.get(ClientRouter['/mpl'].toString(), mplRenderHandler(ClientRouter['/mpl']));

server.get(
  ClientRouter['/object-fe'].toString(),
  objectFeRenderHandler(ClientRouter['/object-fe']),
);

server.get(
  ClientRouter['/object-fe2'].toString(),
  objectFeRenderHandler(ClientRouter['/object-fe2']),
);
