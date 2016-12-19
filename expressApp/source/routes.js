import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomePage from './components/home/HomePage';
import SSRCachingSimpleTypeWrapper from "./components/SSRCaching/SSRCachingSimpleTypeWrapper";
import SSRCachingTemplateTypeWrapper from "./components/SSRCaching/SSRCachingTemplateTypeWrapper";

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/ssrcachingsimpletype" component={SSRCachingSimpleTypeWrapper} />
    <Route path="/ssrcachingtemplatetype" component={SSRCachingTemplateTypeWrapper} />
  </Route>
);