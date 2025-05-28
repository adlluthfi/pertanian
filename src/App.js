import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Layanan from './components/layanan/Layanan';
import Marketplace from './components/marketplace/Marketplace';
import CartPage from './components/cart/CartPage';
import OrderPage from './components/order/OrderPage';
import PaymentPage from './components/payment/PaymentPage';
import Profile from './components/profile/Profile';
import OrdersPage from './components/order/OrdersPage';
import OrderDetailPage from './components/order/OrderDetailPage';
import Konsultasi from './components/konsultasi/Konsultasi';
import Pelatihan from './components/pelatihan/Pelatihan';
import Contact from './components/contact/Contact';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/layanan" element={<Layanan />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/order" element={<OrderPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/payment/:orderId" element={<PaymentPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                    <Route path="/konsultasi" element={<Konsultasi />} />
                    <Route path="/pelatihan" element={<Pelatihan />} />
                    <Route path="/kontak" element={<Contact />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
