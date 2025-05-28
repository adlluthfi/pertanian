import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import apiService from '../../services/api.service';
import { sanitizeInput } from '../../utils/security';
import { useNavigate } from 'react-router-dom';

function LoginModal({ show, handleClose, handleShowRegister, onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const sanitizedData = {
                username: sanitizeInput(username),
                password: sanitizeInput(password)
            };

            const response = await apiService.login(sanitizedData);
            if (response.status === 'success') {
                localStorage.setItem('user', JSON.stringify(response.user));
                localStorage.setItem('token', response.token);
                onLoginSuccess(response.user);
                handleClose();
                // Ubah redirect ke halaman home
                navigate('/');  // Sebelumnya mungkin navigate('/marketplace')
                window.location.reload();
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Username atau password salah');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Masuk</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Pengguna</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Kata Sandi</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100 mb-3"
                        disabled={loading}
                    >
                        {loading ? 'Memproses...' : 'Masuk'}
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <p className="mb-0">Belum punya akun?{' '}
                    <Button 
                        variant="link" 
                        className="p-0" 
                        onClick={() => {
                            handleClose();
                            handleShowRegister();
                        }}
                    >
                        Daftar di sini
                    </Button>
                </p>
            </Modal.Footer>
        </Modal>
    );
}

export default LoginModal;