import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import React from 'react';
import './App.css';        
import PatientList from './pages/PatientList';
import DoctorList from './pages/ListaMedicos';
import LoginCadastro from './pages/LoginCadastro';

function PrivateRoute({ children }) 
{
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login público */}
        <Route path="/" element={<LoginCadastro />} />

        {/* Rotas privadas, só acessa se tiver token */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <PrivateRoute>
              <PatientList />
            </PrivateRoute>
          }
        />
        <Route
          path="/medicos"
          element={
            <PrivateRoute>
              <DoctorList />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
