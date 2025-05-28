import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import LoginModal from '../auth/LoginModal';
import api from '../../utils/axios.config';

function Konsultasi() {
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
            setUser(JSON.parse(loggedUser));
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchMessages();
        }
    }, [user]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/messages/list.php?user_id=${user.id}`);
            if (response.data.status === 'success') {
                setMessages(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleChat = async () => {
        if (!user) {
            setShowLogin(true);
            return;
        }

        if (!newMessage.trim()) {
            return;
        }

        try {
            const response = await api.post('/messages/send.php', {
                user_id: user.id,
                message: newMessage
            });

            if (response.data.status === 'success') {
                // Add message to local state
                setMessages([...messages, {
                    user_id: user.id,
                    message: newMessage,
                    sender_name: user.username,
                    created_at: new Date().toISOString()
                }]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message');
        }
    };

    return (
        <Container className="py-5">
            <Row>
                <Col md={8} className="mx-auto">
                    <Card>
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Konsultasi Online</h5>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            
                            {!user ? (
                                <div className="text-center py-5">
                                    <h4>Silakan login untuk memulai konsultasi</h4>
                                    <Button 
                                        variant="success" 
                                        onClick={() => setShowLogin(true)}
                                        className="mt-3"
                                    >
                                        Login untuk Konsultasi
                                    </Button>
                                </div>
                            ) : (
                                <div className="chat-container">
                                    <div 
                                        className="messages-box mb-3" 
                                        style={{ 
                                            height: '400px', 
                                            overflowY: 'auto',
                                            backgroundColor: '#f8f9fa',
                                            padding: '15px',
                                            borderRadius: '5px'
                                        }}
                                    >
                                        {loading ? (
                                            <div className="text-center">Loading messages...</div>
                                        ) : messages.length === 0 ? (
                                            <div className="text-center text-muted">
                                                Belum ada pesan. Mulai konsultasi sekarang!
                                            </div>
                                        ) : (
                                            messages.map((msg, index) => (
                                                <div 
                                                    key={index} 
                                                    className={`message p-2 mb-2 rounded ${
                                                        msg.user_id === user.id 
                                                            ? 'bg-success text-white ms-auto' 
                                                            : 'bg-white'
                                                    }`}
                                                    style={{ 
                                                        maxWidth: '75%',
                                                        marginLeft: msg.user_id === user.id ? 'auto' : '0'
                                                    }}
                                                >
                                                    <div className="message-header mb-1">
                                                        <small>{msg.sender_name}</small>
                                                    </div>
                                                    <div className="message-content">
                                                        {msg.message}
                                                    </div>
                                                    <div className="message-time">
                                                        <small className="text-muted">
                                                            {new Date(msg.created_at).toLocaleTimeString()}
                                                        </small>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="message-input">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                                                placeholder="Ketik pesan anda..."
                                            />
                                            <Button 
                                                variant="success" 
                                                onClick={handleChat}
                                                disabled={!newMessage.trim()}
                                            >
                                                Kirim
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
        </Container>
    );
}

export default Konsultasi;