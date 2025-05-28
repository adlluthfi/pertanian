import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios.config';

function OrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    navigate('/login');
                    return;
                }

                const response = await api.get(`/orders/list.php?user_id=${user.id}`);
                if (response.data.status === 'success') {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const handleRowClick = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    if (loading) {
        return (
            <Container className="py-5">
                <div className="text-center">Loading...</div>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="mb-4">Pesanan Saya</h2>
            <Card>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Tanggal</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr 
                                    key={order.id} 
                                    onClick={() => handleRowClick(order.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>#{order.id}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>Rp {parseInt(order.total_amount).toLocaleString()}</td>
                                    <td>
                                        <Badge bg={
                                            order.status === 'pending' ? 'warning' :
                                            order.status === 'paid' ? 'info' :
                                            order.status === 'shipped' ? 'primary' :
                                            order.status === 'completed' ? 'success' : 'danger'
                                        }>
                                            {order.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OrdersPage;