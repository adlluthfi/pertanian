import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import api from '../../utils/axios.config';

function Pelatihan() {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
            setUser(JSON.parse(loggedUser));
        }
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        try {
            const response = await api.get('/trainings/list.php');
            if (response.data.status === 'success') {
                setTrainings(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching trainings:', error);
            setError('Gagal memuat data pelatihan');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (trainingId) => {
        if (!user) {
            alert('Silakan login terlebih dahulu');
            return;
        }

        try {
            const response = await api.post('/trainings/register.php', {
                user_id: user.id,
                training_id: trainingId
            });

            if (response.data.status === 'success') {
                alert('Pendaftaran berhasil');
                fetchTrainings();
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert(error.response?.data?.message || 'Gagal mendaftar pelatihan');
        }
    };

    if (loading) return (
        <Container className="py-5 text-center">
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </Container>
    );

    if (error) return (
        <Container className="py-5">
            <div className="alert alert-danger">{error}</div>
        </Container>
    );

    return (
        <Container className="py-5">
            <h2 className="mb-4">Program Pelatihan</h2>
            <Row>
                {trainings.map(training => (
                    <Col key={training.id} md={4} className="mb-4">
                        <Card className="h-100">
                            {training.image && (
                                <Card.Img 
                                    variant="top" 
                                    src={training.image} 
                                    alt={training.title}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <Card.Body>
                                <Card.Title>{training.title}</Card.Title>
                                <div className="mb-2">
                                    <Badge bg={training.status === 'active' ? 'success' : 'secondary'}>
                                        {training.status === 'active' ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
                                    </Badge>
                                </div>
                                <Card.Text>{training.description}</Card.Text>
                                <div className="mb-3">
                                    <p className="mb-1"><small>📅 Tanggal: {new Date(training.date).toLocaleDateString('id-ID')}</small></p>
                                    <p className="mb-1"><small>⏰ Waktu: {training.time}</small></p>
                                    <p className="mb-1"><small>📍 Lokasi: {training.location}</small></p>
                                    <p className="mb-1">
                                        <small>👥 Peserta: {training.registered_count || 0}/{training.quota}</small>
                                    </p>
                                </div>
                            </Card.Body>
                            <Card.Footer className="bg-white">
                                <Button 
                                    variant="success" 
                                    className="w-100"
                                    onClick={() => handleRegister(training.id)}
                                    disabled={
                                        training.status !== 'active' || 
                                        (training.registered_count >= training.quota)
                                    }
                                >
                                    {training.registered_count >= training.quota 
                                        ? 'Kuota Penuh'
                                        : 'Daftar Sekarang'
                                    }
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Pelatihan;