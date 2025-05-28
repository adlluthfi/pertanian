import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

function Dashboard() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
            setUser(JSON.parse(loggedUser));
        }
    }, []);

    const handleShowLogin = () => {
        setShowRegister(false);
        setShowLogin(true);
    };

    const handleShowRegister = () => {
        setShowLogin(false);
        setShowRegister(true);
    };

    const handleCloseLogin = () => setShowLogin(false);
    const handleCloseRegister = () => setShowRegister(false);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        window.location.reload();
    };

    return (
        <Container className="py-4">
            {!user ? (
                <Row className="mb-4">
                    <Col className="text-center">
                        <h4>Selamat Datang di Portal Pertanian</h4>
                    </Col>
                </Row>
            ) : null}

            <Row className="mb-4">
        
            </Row>
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Statistik Pertanian</Card.Title>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Total Lahan:</span>
                                <span>100 Hektar</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Hasil Panen:</span>
                                <span>500 Ton</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Info Cuaca</Card.Title>
                            <div className="text-center">
                                <i className="fas fa-sun fa-3x mb-2"></i>
                                <h4>28°C</h4>
                                <div>Cerah Berawan</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Jadwal Tanam</Card.Title>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2">Padi - Maret 2024</li>
                                <li className="mb-2">Jagung - Juni 2024</li>
                                <li>Kedelai - September 2024</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Berita Pertanian Terkini</Card.Title>
                            <div className="news-list">
                                <ul className="list-unstyled">
                                    <li className="mb-3">
                                        <h6>Teknologi Pertanian Modern</h6>
                                        <div className="text-muted">
                                            Penggunaan drone untuk monitoring lahan pertanian...
                                        </div>
                                    </li>
                                    <li>
                                        <h6>Tips Meningkatkan Hasil Panen</h6>
                                        <div className="text-muted">
                                            Metode terbaru dalam pengolahan tanah...
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Kalender Pertanian</Card.Title>
                            <div className="calendar-preview text-center">
                                Mei 2024
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Login Modal */}
            <LoginModal 
                show={showLogin} 
                handleClose={handleCloseLogin} 
                handleShowRegister={handleShowRegister}
            />
            <RegisterModal 
                show={showRegister} 
                handleClose={handleCloseRegister}
                handleShowLogin={handleShowLogin}
            />
        </Container>
    );
}

export default Dashboard;