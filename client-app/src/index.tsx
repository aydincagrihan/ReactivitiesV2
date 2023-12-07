import ReactDOM from 'react-dom/client';
import 'semantic-ui-css/semantic.min.css'
import './app/layout/styles.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import { StoreContext, store } from './app/stores/store';
import { router } from './app/router/Route';
import 'react-calendar/dist/Calendar.css';
import React from 'react';
import { RouterProvider } from 'react-router-dom';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //RouterProvider eklendi,App artık router in içinde
  <React.StrictMode>
    <StoreContext.Provider value={store} >
      <RouterProvider router={router} />
    </StoreContext.Provider>
  </React.StrictMode>

);
