import React, { useEffect, useState, useCallback } from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import api from '../../utils/axios.config';
import { getCSRFToken } from '../../utils/csrf';

function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    // Initialize CSRF token
    useEffect(() => {
        getCSRFToken();
    }, []);

    // Add user effect to handle authentication state
    useEffect(() => {
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
            setUser(JSON.parse(loggedUser));
        }
    }, []);

    // Add cart count effect
    useEffect(() => {
        if (user) {
            fetchCartCount();
        }
    }, [user]);

    const fetchCartCount = useCallback(async () => {
        if (!user) return;
        
        try {
            const response = await api.get('/cart/count.php', {
                params: { user_id: user.id }
            });
            
            if (response.data.status === 'success') {
                setCartCount(response.data.count);
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
            setCartCount(0);
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/', { replace: true });
    };

    const handleNavClick = (path) => (e) => {
        e.preventDefault();
        if (!user && path !== '/' && path !== '/layanan') {
            setShowLogin(true);
            return;
        }
        navigate(path);
    };

    return (
        <>
            <Navbar bg="success" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand onClick={handleNavClick('/')} style={{ cursor: 'pointer' }}>
                        Sistem Pertanian
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto" activeKey={location.pathname}>
                            <Nav.Link onClick={handleNavClick('/')}>Home</Nav.Link>
                            <Nav.Link onClick={handleNavClick('/layanan')}>Layanan</Nav.Link>
                            <Nav.Link onClick={handleNavClick('/kontak')}>Kontak</Nav.Link>
                            {user ? (
                                <NavDropdown title={user.username} id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={() => navigate('/profile')}>
                                        Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => navigate('/orders')}>
                                        Pesanan Saya
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link onClick={() => setShowLogin(true)}>Login</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                {children}
            </Container>

            <LoginModal 
                show={showLogin}
                handleClose={() => setShowLogin(false)}
                handleShowRegister={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                }}
                onLoginSuccess={(userData) => {
                    setUser(userData);
                    setShowLogin(false);
                    // Navigate to intended page after login
                    if (location.pathname === '/') {
                        navigate('/marketplace', { replace: true });
                    }
                }}
            />

            <RegisterModal
                show={showRegister}
                handleClose={() => setShowRegister(false)}
                handleShowLogin={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                }}
            />
        </>
    );
}

export default Layout;