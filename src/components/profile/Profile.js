import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios.config';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        name: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const loggedUser = localStorage.getItem('user');
        if (!loggedUser) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(loggedUser));
        fetchProfile(JSON.parse(loggedUser).id);
    }, [navigate]);

    const fetchProfile = async (userId) => {
        try {
            const response = await api.get(`/profile/get.php?user_id=${userId}`);
            if (response.data.status === 'success') {
                setProfileData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/profile/update.php', {
                user_id: user.id,
                ...profileData
            });

            if (response.data.status === 'success') {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'danger', text: 'Failed to update profile' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'danger', text: 'Error updating profile' });
        }
    };

    if (loading) {
        return (
            <Container className="py-5">
                <p>Loading...</p>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row>
                <Col md={8} className="mx-auto">
                    <Card>
                        <Card.Header>
                            <h4 className="mb-0">Profile Settings</h4>
                        </Card.Header>
                        <Card.Body>
                            {message.text && (
                                <Alert variant={message.type} dismissible>
                                    {message.text}
                                </Alert>
                            )}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            username: e.target.value
                                        })}
                                        disabled
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            email: e.target.value
                                        })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            name: e.target.value
                                        })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            phone: e.target.value
                                        })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            address: e.target.value
                                        })}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="success" type="submit">
                                    Update Profile
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;