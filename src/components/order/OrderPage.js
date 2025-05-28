import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../../utils/axios.config';
import { clearCart } from '../../store/cartSlice';

function OrderPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        address: '',
        phone: '',
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const calculateTotal = useCallback((items) => {
        const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotal(sum);
    }, []);

    const fetchCart = useCallback(async (userId) => {
        try {
            setLoading(true);
            const response = await api.get(`/cart/cart.php?user_id=${userId}`);
            console.log('Cart Response:', response.data);

            if (response.data.status === 'success') {
                setCart(response.data.data);
                calculateTotal(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setError('Failed to load cart items');
        } finally {
            setLoading(false);
        }
    }, [calculateTotal]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(userData); // Set user data
        fetchCart(userData.id);
    }, [navigate, fetchCart]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const orderData = {
                user_id: parseInt(user.id),
                shipping_info: {
                    name: shippingInfo.name.trim(),
                    address: shippingInfo.address.trim(),
                    phone: shippingInfo.phone.trim()
                },
                cart: cart.map(item => ({
                    product_id: parseInt(item.id),
                    quantity: parseInt(item.quantity),
                    price: parseFloat(item.price)
                })),
                total: parseFloat(total)
            };

            const response = await api.post('/orders/create.php', orderData);
            
            if (response.data.status === 'success') {
                // Update to use the new action
                dispatch(clearCart());
                navigate(`/payment/${response.data.order_id}`);
            } else {
                setError(response.data.message || 'Gagal membuat pesanan');
            }
        } catch (error) {
            console.error('Error details:', error.response?.data);
            setError(error.response?.data?.message || 'Terjadi kesalahan saat membuat pesanan');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container className="py-5">
                <div className="text-center">Loading...</div>
            </Container>
        );
    }

    if (cart.length === 0) {
        return (
            <Container className="py-5">
                <Card>
                    <Card.Body className="text-center">
                        <h4>Your cart is empty</h4>
                        <Button 
                            variant="success" 
                            onClick={() => navigate('/marketplace')}
                            className="mt-3"
                        >
                            Continue Shopping
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="mb-4">Order Summary</h2>
            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}
            
            {/* Order Items Card */}
            <Card className="mb-4">
                <Card.Header>Items in Cart</Card.Header>
                <Card.Body>
                    {cart.map(item => (
                        <div key={item.id} className="d-flex justify-content-between mb-2">
                            <div>{item.name} x {item.quantity}</div>
                            <div>Rp {(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                    ))}
                    <hr />
                    <div className="d-flex justify-content-between">
                        <h5>Total</h5>
                        <h5>Rp {total.toLocaleString()}</h5>
                    </div>
                </Card.Body>
            </Card>

            {/* Shipping Information Card */}
            <Card>
                <Card.Header>Shipping Information</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Penerima</Form.Label>
                            <Form.Control
                                type="text"
                                value={shippingInfo.name}
                                onChange={(e) => setShippingInfo({
                                    ...shippingInfo,
                                    name: e.target.value
                                })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Alamat Lengkap</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={shippingInfo.address}
                                onChange={(e) => setShippingInfo({
                                    ...shippingInfo,
                                    address: e.target.value
                                })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nomor Telepon</Form.Label>
                            <Form.Control
                                type="tel"
                                value={shippingInfo.phone}
                                onChange={(e) => setShippingInfo({
                                    ...shippingInfo,
                                    phone: e.target.value
                                })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Catatan</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={shippingInfo.notes}
                                onChange={(e) => setShippingInfo({
                                    ...shippingInfo,
                                    notes: e.target.value
                                })}
                            />
                        </Form.Group>

                        <Button 
                            variant="success" 
                            type="submit"
                            className="w-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OrderPage;