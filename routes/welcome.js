import axios from 'axios';
import User from '../models';

export default router =>
  router
    .get('root', '/', async (ctx) => {
      try {
        await User.User.create({ firstName: 'art', lastName: 'iv' });
      } catch (e) {
        console.log(e.message);
      }
      ctx.body = 'welcome/index';
    });
