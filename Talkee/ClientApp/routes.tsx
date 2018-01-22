import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import Conversations from './components/Conversations';
import Login from './components/Login';
import Logout from './components/Logout';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/counter' component={ Counter } />
    <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
    <Route path='/conversations' component={Conversations} />
    <Route path='/login' component={Login} />
    <Route path='/logout' component={Logout} />
</Layout>;
