// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EventForm from './components/EventForm';
import Login from './components/Login';
import Register from './components/Register';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import Navbar from './components/Navbar';

import SearchResults from './components/SearchResults';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import ContactUs from './components/Contact';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/event/new" component={EventForm} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/events" component={EventList} />
        <Route exact path="/events/:id" component={EventDetail} />
        <Route exact path="/contact" component={ContactUs} />
        <Route exact path="/search" component={SearchResults} />
        
      </Switch>
    </Router>
  );
}

export default App;                                                                                   