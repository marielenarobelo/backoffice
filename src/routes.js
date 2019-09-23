import React from 'react';

//const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Applications = React.lazy(() => import('./views/Applications'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/applications', name: 'Applications', component: Applications }
];

export default routes;
