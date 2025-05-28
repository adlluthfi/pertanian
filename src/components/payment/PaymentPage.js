import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Row, Col, Button, Alert, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/axios.config';

function PaymentPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

    const fetchOrderDetails = useCallback(async () => {
        try {
            const response = await api.get(`/orders/detail.php?id=${orderId}`);
            if (response.data.status === 'success') {
                setOrder({
                    ...response.data.data,
                    total: response.data.data.total_amount // Use total_amount from database
                });
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            setPaymentStatus('processing');
            
            const response = await api.post('/payments/process.php', {
                order_id: orderId,
                card_info: {
                    cardNumber: cardInfo.cardNumber.replace(/\s/g, ''),
                    cardHolder: cardInfo.cardHolder,
                    expiryDate: cardInfo.expiryDate,
                }
            });

            if (response.data.status === 'success') {
                setPaymentStatus('success');
                setTimeout(() => {
                    navigate('/orders');
                }, 3000);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setPaymentStatus('failed');
        }
    };

    if (loading) {
        return <Container className="py-5"><p>Loading...</p></Container>;
    }

    if (!order) {
        return (
            <Container className="py-5">
                <Alert variant="danger">Order not found</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="mb-4">Pembayaran dengan Kartu Debit</h2>
            {paymentStatus === 'success' && (
                <Alert variant="success">
                    Pembayaran berhasil! Anda akan diarahkan ke halaman pesanan...
                </Alert>
            )}
            {paymentStatus === 'failed' && (
                <Alert variant="danger">
                    Pembayaran gagal! Silakan coba lagi.
                </Alert>
            )}
            <Row>
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Form onSubmit={handlePayment}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nomor Kartu</Form.Label>
                                    <Form.Control
                                        type="text"
                                        maxLength="16"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardInfo.cardNumber}
                                        onChange={(e) => setCardInfo({
                                            ...cardInfo,
                                            cardNumber: e.target.value.replace(/\D/g, '')
                                        })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Nama Pemegang Kartu</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="NAMA SESUAI KARTU"
                                        value={cardInfo.cardHolder}
                                        onChange={(e) => setCardInfo({
                                            ...cardInfo,
                                            cardHolder: e.target.value.toUpperCase()
                                        })}
                                        required
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={8}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tanggal Kadaluarsa</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                value={cardInfo.expiryDate}
                                                onChange={(e) => {
                                                    let value = e.target.value;
                                                    value = value.replace(/\D/g, '');
                                                    if (value.length >= 2) {
                                                        value = value.slice(0, 2) + '/' + value.slice(2);
                                                    }
                                                    setCardInfo({
                                                        ...cardInfo,
                                                        expiryDate: value
                                                    });
                                                }}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>CVV</Form.Label>
                                            <Form.Control
                                                type="password"
                                                maxLength="3"
                                                placeholder="123"
                                                value={cardInfo.cvv}
                                                onChange={(e) => setCardInfo({
                                                    ...cardInfo,
                                                    cvv: e.target.value.replace(/\D/g, '')
                                                })}
                                                required
                                                autoComplete="cc-csc"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant="success" type="submit" className="w-100">
                                    Bayar Rp {parseInt(order?.total_amount || 0).toLocaleString()}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <h5 className="mb-3">Detail Pesanan</h5>
                            <p>Order ID: #{orderId}</p>
                            <p>Total: Rp {parseInt(order?.total_amount || 0).toLocaleString()}</p>
                            <hr />
                            <h6>Alamat Pengiriman:</h6>
                            <p className="mb-0">{order?.shipping_name}</p>
                            <p className="mb-0">{order?.shipping_phone}</p>
                            <p>{order?.shipping_address}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PaymentPage;