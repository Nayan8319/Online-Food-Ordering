import React from 'react';
import ReactDOM from 'react-dom/client';
import Mainrouter from './Mainrouter.jsx';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';           // Import Provider
import store from './redux/store';                 // Import your Redux store

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Enables Bootstrap JS components

import './assets/css/animation.css';
import './assets/css/animationmain.css';
import './assets/css/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>             {/* Wrap app with Provider */}
    <RouterProvider router={Mainrouter} />
  </Provider>
);
