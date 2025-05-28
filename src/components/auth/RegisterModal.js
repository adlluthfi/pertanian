import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import apiService from '../../services/api.service';

function RegisterModal({ show, handleClose, handleShowLogin }) {
    const [dataRegister, setDataRegister] = useState({
        username: '',
        email: '',
        password: '',
        konfirmasiPassword: ''
    });
    const [pesanError, setPesanError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPesanError('');

        if (dataRegister.password !== dataRegister.konfirmasiPassword) {
            setPesanError('Konfirmasi password tidak sesuai');
            setLoading(false);
            return;
        }

        try {
            const { konfirmasiPassword, ...dataToSend } = dataRegister;
            const response = await apiService.register(dataToSend);

            if (response.status === 'success') {
                handleClose();
                handleShowLogin();
            }
        } catch (error) {
            setPesanError(error.response?.data?.message || 'Gagal mendaftar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Daftar Akun</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {pesanError && <Alert variant="danger">{pesanError}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Pengguna</Form.Label>
                        <Form.Control
                            type="text"
                            value={dataRegister.username}
                            onChange={(e) => setDataRegister({
                                ...dataRegister,
                                username: e.target.value
                            })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={dataRegister.email}
                            onChange={(e) => setDataRegister({
                                ...dataRegister,
                                email: e.target.value
                            })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Kata Sandi</Form.Label>
                        <Form.Control
                            type="password"
                            value={dataRegister.password}
                            onChange={(e) => setDataRegister({
                                ...dataRegister,
                                password: e.target.value
                            })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Konfirmasi Kata Sandi</Form.Label>
                        <Form.Control
                            type="password"
                            value={dataRegister.konfirmasiPassword}
                            onChange={(e) => setDataRegister({
                                ...dataRegister,
                                konfirmasiPassword: e.target.value
                            })}
                            required
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100 mb-3"
                        disabled={loading}
                    >
                        {loading ? 'Memproses...' : 'Daftar'}
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <p className="mb-0">Sudah punya akun?{' '}
                    <Button 
                        variant="link" 
                        className="p-0" 
                        onClick={() => {
                            handleClose();
                            handleShowLogin();
                        }}
                    >
                        Masuk di sini
                    </Button>
                </p>
            </Modal.Footer>
        </Modal>
    );
}

export default RegisterModal;