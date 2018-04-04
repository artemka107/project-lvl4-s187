import debug from 'debug';
import getApp from '..';

const log = debug('app');

getApp().listen(process.env.PORT || 3000, () => {
  log('server startet');
});
