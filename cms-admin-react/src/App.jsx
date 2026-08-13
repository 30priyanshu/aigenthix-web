import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Landing from './pages/Landing';
import GenericList from './pages/GenericList';
import GenericForm from './pages/GenericForm';
import UserManagement from './pages/UserManagement';
import AuthorsPage from './pages/AuthorsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Navigate to="/admin/blogs" replace />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="authors" element={<AuthorsPage key="authors" type="Authors" />} />
          <Route path="factcheckers" element={<AuthorsPage key="factcheckers" type="Fact Checkers" />} />
          <Route path=":type" element={<GenericList />} />
          <Route path=":type/new" element={<GenericForm />} />
          <Route path=":type/edit/:id" element={<GenericForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
