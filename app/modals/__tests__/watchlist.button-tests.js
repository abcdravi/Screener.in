'use strict';
jest.disableAutomock();
jest.mock('fetch-on-rest');
var TestUtils = require('react-addons-test-utils');
var React = require('react');
var WatchlistButton = require('../watchlist.button.jsx');
var api = require('../../api.js');


describe('Watchlist Button tests', function() {
  var watchlist;

  beforeEach(function() {
    window.loggedIn = true;
    var onClose = jest.genMockFunction();
    watchlist = TestUtils.renderIntoDocument(
      <WatchlistButton onClose={onClose} />
    );
  });

  afterEach(function() {
    expect(api.getPending()).toEqual([]);
  });

  it('should load companies on open', function() {
    // Open the modal
    var button = TestUtils.findRenderedDOMComponentWithTag(
      watchlist, 'button'
    );
    var fooCompany = {name: 'Foo', id: 1, url: '/bar/'}
    api.setResponse('/api/company/', JSON.stringify([fooCompany]));
    TestUtils.Simulate.click(button);
    return watchlist.req.then(() => {
      expect(watchlist.state.items).toEqual([fooCompany]);
    });
  })

  it('adds company', function() {
    var company = {name: 'Patanjali', id: 7, url: '/ramdev/'};
    api.setResponse('/api/company/7/favorite/', JSON.stringify([company]));
    return watchlist.handleAdd(company).then(() => {
      expect(watchlist.state.items).toEqual([company]);
    });
  });
});
