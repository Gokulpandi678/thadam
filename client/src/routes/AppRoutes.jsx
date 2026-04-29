import { Routes, Route } from "react-router-dom";
import CustomerPage from "../pages/CustomerPage";
import MainLayout from "../ui/layouts/MainLayout";
import Login from "../pages/Login";
import ContactFormPage from "../pages/ContactFormPage";
import ContactDetailPage from "../pages/ContactDetailPage";
import Dashboard from "../pages/Dashboard";
import ContactRecycleBin from "../pages/ContactRecycleBin";
import ClientsPage from "../pages/ClientsPage";
import ClientDetailPage from "../pages/ClientDetailPage";
import { ClientContextProvider } from "../context/ClientContext";

const AppRoutes = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<CustomerPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact-form" element={<ContactFormPage />} />
        <Route path="/customer/:id" element={<ContactDetailPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recycle-bin" element={<ContactRecycleBin />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:customerId" element={<ClientDetailPage />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;