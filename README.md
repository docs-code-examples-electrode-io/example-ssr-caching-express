# example-ssr-caching-express
* This repo is an example express.js app with [electrode-react-ssr-caching] module fully integrated
* The step-by-step instructions on building it from scratch can be found below

## <a name="ssr-caching"></a>Electrode React SSR Caching

[electrode-react-ssr-caching] module supports profiling React Server Side Rendering time and component caching to help you speed up SSR.

It supports 2 types of caching:

* Simple - Component Props become the cache key. This is useful for cases like Header and Footer where the number of variations of props data is minimal which will make sure the cache size stays small.
* Template - Components Props are first tokenized and then the generated template html is cached. The idea is akin to generating logic-less handlebars template from your React components and then use string replace to process the template with different props. This is useful for cases like displaying Product information in a Carousel where you have millions of products in the repository.

## Instructions

## <a name="express-server"></a>Express Server
* Let's use the [express-react-redux-starter] repo to scaffold our app.
* Create a hapi app using the following commands:

```bash
git clone https://github.com/electrode-samples/express-react-redux-starter.git expressApp
cd expressApp
npm install
```

* Ensure that you have a working app by running the following:

```bash
NODE_ENV=development npm start
```

* From your browser, navigate to `http://localhost:3000` to see the default web page

### <a name="ssr-caching"></a>Electrode React SSR Caching Install
* Install the [electrode-react-ssr-caching] module with the following:

```bash
npm install --save react@15.3.0
npm install --save react-dom@15.3.0
npm install --save react-router@3.0.0
npm install --save electrode-react-ssr-caching
```

* Note: The current version of `electrode-react-ssr-caching v0.1.5` requires `react v15.3.0`, `react-dom v15.3.0`, and 
`react-router v3.0.0`

* Import SSRCaching in `expressApp/tools/express/server.js`

```js
import SSRCaching from "electrode-react-ssr-caching";
```

### *** Important Notes ***
* Make sure the `electrode-react-ssr-caching` module is imported first followed by the imports of `react` and `react-dom` module.
* SSR caching will not work if the ordering is changed since caching module has to have a chance to patch react's code first.
* If you are importing `electrode-react-ssr-caching`, `react` and `react-dom` in the same file, make sure
you are using all `require` or all `import`. Found that SSR caching was NOT working if, `electrode-react-ssr-caching`
is `require`d first and then `react` and `react-dom` is imported.

* Enable caching by adding the configuration code in `expressApp/tools/express/server.js`

```js
const cacheConfig = {
  components: {
    SSRCachingTemplateType: {
      strategy: "template",
      enable: true
    },
    SSRCachingSimpleType: {
      strategy: "simple",
      enable: true
    }
  }
};

SSRCaching.enableCaching();
SSRCaching.setCachingConfig(cacheConfig);
```

### <a name="ssr-demo-code"></a>SSR Demo Code
* In order to test Server Side Rendering functionality, we need to add a few files:

* For simple strategy, add the following:

* `expressApp/source/components/SSRCaching/SSRCachingSimpleType.js`

```jsx
import React, { Component, PropTypes } from "react";

class SSRCachingSimpleType extends Component {
  render() {
    return (
      <div>
        <p>{this.props.navEntry}</p>
      </div>
    );
  }
}

SSRCachingSimpleType.propTypes = {
  navEntry: PropTypes.string.isRequired
};

export default SSRCachingSimpleType;
```

* `expressApp/source/components/SSRCaching/SSRCachingSimpleTypeWrapper.js`

```jsx
import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import SSRCachingSimpleType from "./SSRCachingSimpleType";

class SSRCachingSimpleTypeWrapper extends Component {
  render() {
    const count = this.props.count;

    let elements = [];

    for (let i = 0; i < count; i++) {
      elements.push(<SSRCachingSimpleType key={i} navEntry={"NavEntry" + i} />);
    }

    return (
      <div>
        {elements}
      </div>
    );
  }
}

SSRCachingSimpleTypeWrapper.propTypes = {
  count: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
  count: state.count
});

export default connect(
  mapStateToProps
)(SSRCachingSimpleTypeWrapper);
```

* For Template strategy, add the following:

* `expressApp/source/components/SSRCaching/SSRCachingTemplateType.js`

```jsx
import React, { Component, PropTypes } from "react";

class SSRCachingTemplateType extends Component {
  render() {
    return (
      <div>
        <p>{this.props.name} and {this.props.title} and {this.props.rating}</p>
      </div>
    );
  }
}

SSRCachingTemplateType.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired
};

export default SSRCachingTemplateType;
```

* `expressApp/source/components/SSRCaching/SSRCachingTemplateTypeWrapper.js`

```jsx
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import SSRCachingTemplateType from "./SSRCachingTemplateType";

class SSRCachingTemplateTypeWrapper extends React.Component {
  render() {
    const count = this.props.count;
    let elements = [];

    for(let i = 0; i < count; i++) {
      elements.push(<SSRCachingTemplateType key={i} name={"name"+i} title={"title"+i} rating={"rating"+i}/>);
    }

    return (
      <div>
        {elements}
      </div>
    );
  }
}

SSRCachingTemplateTypeWrapper.propTypes = {
  count: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
  count: state.count
});

export default connect(
  mapStateToProps
)(SSRCachingTemplateTypeWrapper);
```

* Add the routes to our new components.
* Replace the contents of `expressApp/source/routes.js` with the following:

```js
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
```

* Wire up the home page with our new routes.
* Add the following `expressApp/src/components/home/HomePage.js`:

```jsx
import React, { Component } from "react";

class HomePage extends Component {
  render() {
    return (
      <div>
        <h1>Hello <a href="https://github.com/electrode-io">Electrode</a></h1>
        <h2>Demonstration Components</h2>
        <ul>
          <li className="ssr simple">
            <a href="/ssrcachingsimpletype">
              SSR Caching - Simple
            </a>
            <p>Component Props become the cache key. This is useful for cases like Header and Footer where the number
              of variations of props data is minimal which will make sure the cache size stays small.</p>
          </li>
          <li className="ssr caching">
            <a href="/ssrcachingtemplatetype">
              SSR Caching- Template Type
            </a>
            <p>Components Props are first tokenized and then the generated template html is cached. The idea is akin to
              generating logic-less handlebars template from your React components and then use string replace to process
              the template with different props. This is useful for cases like displaying Product information in a
              Carousel where you have millions of products in the repository.</p>
          </li>
        </ul>
      </div>
    );
  }
}

export default HomePage; 
```

* Remove the header from the `App.js` like such: 

```jsx
import React, {Component, PropTypes} from 'react';

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
```

### Redux Configuration
* Replace the contents of `expressApp/source/reducers/index.js` with the following:

```js
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  routing: routerReducer,
  count: (s=100, a) => s
});

export default rootReducer;
```

* From `expressApp/tools/express/server.js` replace the line:

```
const store = configureStore();
```

with:

```
const store = configureStore({count: 100});
```

* Run the server:

```bash
NODE_ENV=production npm start
```

* Navigate to the url and port number displayed in the terminal, both links for for Simple and Template Type should return a list of 100 items

### *** Important Notes ***
* SSR caching of components only works in PRODUCTION mode, since the props(which are read only) are mutated for caching purposes and mutating of props is not allowed in development mode by react.
* To read more, go to [electrode-react-ssr-caching]

---

[electrode-react-ssr-caching]: https://github.com/electrode-io/electrode-react-ssr-caching
[express-react-redux-starter]: https://github.com/electrode-samples/express-react-redux-starter