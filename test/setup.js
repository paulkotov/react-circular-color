/* global document */

// https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md#using-enzyme-with-jsdom

const jsdom = require('jsdom').jsdom;
require('./components/CircularColor.spec');

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};
