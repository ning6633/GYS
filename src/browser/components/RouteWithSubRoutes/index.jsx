import React, { Component } from 'react';
import { Route } from 'react-router-dom';

const supportsHistory = 'pushState' in window.history;
// 对react 路由模块进行了封装
const RouteWithSubRoutes = route => (
    <Route
        path={route.path}
        exact={route.exact}
        forceRefresh={!supportsHistory}
        render={props => (
            // pass the sub-routes down to keep nesting
            <route.component {...props} routes={route.routes} />
        )}
    />
);

export default RouteWithSubRoutes;