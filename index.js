import 'babel-polyfill';

import path from 'path';
import Rollbar from 'rollbar';
import Koa from 'koa';
import Router from 'koa-router';
import Pug from 'koa-pug';
import serve from 'koa-static';
import middleware from 'koa-webpack';
import bodyParser from 'koa-bodyparser';
import dotenv from 'dotenv';
import session from 'koa-generic-session';
import flash from 'koa-flash-simple';
import _ from 'lodash';
import methodOverride from 'koa-methodoverride';
import addRoutes from './routes';
import getWebpackConfig from './webpack.config.babel';

export default () => {
  dotenv.config();

  const app = new Koa();

  const rollbar = new Rollbar('POST_SERVER_ITEM_ACCESS_TOKEN');
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      rollbar.error(err, ctx.request);
    }
  });

  app.use(session(app));
  app.use(flash());
  app.use(async (ctx, next) => {
    ctx.state = {
      flash: ctx.flash,
      isSignedIn: () => ctx.session.userId !== undefined,
    };
    await next();
  });
  app.use(bodyParser());
  app.use(methodOverride('_method'));
  app.use(serve(path.join(__dirname, 'public')));

  const router = new Router();
  addRoutes(router);
  app.use(router.allowedMethods());
  app.use(router.routes());

  const pug = new Pug({
    viewPath: path.join(__dirname, 'views'),
    debug: true,
    pretty: true,
    compileDebug: true,
    locals: [],
    basedir: path.join(__dirname, 'views'),
    helperPath: [
      { _ },
      { urlFor: (...args) => router.url(...args) },
    ],
  });
  pug.use(app);


  if (process.env.NODE_ENV !== 'production') {
    app.use(middleware({
      config: getWebpackConfig(),
      dev: {
        publicPath: getWebpackConfig().output.publicPath,
      },
    }));
  }

  return app;
};
