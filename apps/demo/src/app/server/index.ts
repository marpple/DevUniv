import { app } from '@rune-ts/server';
import type { LayoutData } from '@rune-ts/server';
import UAParser from 'ua-parser-js';
import favicon from '../../../public/favicon.png';
import { ClientRouter } from '../route';
import { HelloWorldRender } from '../../pages/HelloWorld/HelloWorld.render';

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
      title: 'Hello World',
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
server.get(ClientRouter['/'].toString(), HelloWorldRender(ClientRouter['/']));
