import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import api from '../../utils/axios.config';

function OrderDetailPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await api.get(`/orders/detail.php?id=${orderId}`);
                if (response.data.status === 'success') {
                    setOrder(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching order:', error);
                setError('Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId]);

    if (loading) {
        return (
            <Container className="py-5">
                <div className="text-center">Loading...</div>
            </Container>
        );
    }

    if (error || !order) {
        return (
            <Container className="py-5">
                <Card>
                    <Card.Body className="text-center text-danger">
                        {error || 'Order not found'}
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Detail Pesanan #{order.id}</h5>
                        <Badge bg={
                            order.status === 'pending' ? 'warning' :
                            order.status === 'paid' ? 'info' :
                            order.status === 'shipped' ? 'primary' :
                            order.status === 'completed' ? 'success' : 'danger'
                        }>
                            {order.status}
                        </Badge>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <h6>Informasi Pengiriman</h6>
                            <p className="mb-1">Nama: {order.shipping_name}</p>
                            <p className="mb-1">Telepon: {order.shipping_phone}</p>
                            <p className="mb-1">Alamat: {order.shipping_address}</p>
                            {order.shipping_notes && (
                                <p className="mb-1">Catatan: {order.shipping_notes}</p>
                            )}
                        </Col>
                        <Col md={6}>
                            <h6>Informasi Pembayaran</h6>
                            <p className="mb-1">Total: Rp {parseInt(order.total_amount).toLocaleString()}</p>
                            <p className="mb-1">Status Pembayaran: 
                                <Badge bg={
                                    order.payment_status === 'completed' ? 'success' :
                                    order.payment_status === 'failed' ? 'danger' : 'warning'
                                } className="ms-2">
                                    {order.payment_status || 'pending'}
                                </Badge>
                            </p>
                            {order.card_number && (
                                <>
                                    <p className="mb-1">Nomor Kartu: {order.card_number}</p>
                                    <p className="mb-1">Nama Pemegang Kartu: {order.card_holder}</p>
                                    <p className="mb-1">Tanggal Kadaluarsa: {order.expiry_date}</p>
                                </>
                            )}
                        </Col>
                    </Row>

                    <h6 className="mt-4">Detail Produk</h6>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Produk</th>
                                <th>Harga</th>
                                <th>Jumlah</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.product_name}</td>
                                    <td>Rp {parseInt(item.price).toLocaleString()}</td>
                                    <td>{item.quantity}</td>
                                    <td>Rp {(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                <td><strong>Rp {parseInt(order.total_amount).toLocaleString()}</strong></td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OrderDetailPage;