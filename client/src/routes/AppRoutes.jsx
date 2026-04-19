import { Routes, Route, Navigate } from "react-router-dom";
import CustomerPage from "../pages/CustomerPage";
import MainLayout from "../ui/layouts/MainLayout";
import Login from "../pages/Login";
import ContactFormPage from "../pages/ContactFormPage";
import ContactDetailPage from "../pages/ContactDetailPage";
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  return (
    <MainLayout>
        <Routes>
            <Route path='/' element={<CustomerPage />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/contact-form" element={<ContactFormPage />}/>
            <Route path="/customer/:id" element={<ContactDetailPage />} />
            <Route path="/dashboard" element={<Dashboard />}/>
        </Routes>
    </MainLayout>
  );
};

export default AppRoutes;