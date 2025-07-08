/* eslint-disable no-unused-vars */
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const ViewTable = Loadable(lazy(() => import('../views/dynamicCMS/TableList')));
const Form = Loadable(lazy(() => import('../views/dynamicCMS/Form')));
const AddPage = Loadable(lazy(() => import('../views/dynamicCMS/AddPage')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

const Login = Loadable(lazy(() => import('../views/authentication/auth/Login')));
const Register = Loadable(lazy(() => import('../views/authentication/auth/Register')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth/ForgotPassword')));

const Router = [
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { 
        path: 'login', 
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ) 
      },
      { 
        path: 'register', 
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ) 
      },
      { 
        path: 'forgot-password', 
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ) 
      },
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      // Sample page route
      { path: '/sample-page', element: <SamplePage /> },
      
      // Dynamic CMS routes
      { path: '/:tableName', exact: true, element: <ViewTable /> },
      { path: '/:tableName/add', exact: true, element: <AddPage /> },
      { path: '/:tableName/edit/:id', exact: true, element: <Form /> },
      { path: '/:tableName/view/:id', exact: true, element: <Form /> },

      // Default redirect for root path
      { path: '', element: <Navigate to="/blogs" replace /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
