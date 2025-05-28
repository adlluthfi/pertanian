import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios.config';

function CartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);

    const fetchCart = useCallback(async (userId) => {
        try {
            const response = await api.get(`/cart/cart.php?user_id=${userId}`);
            console.log('Cart Response:', response.data); // Debug log
            
            if (response.data.status === 'success') {
                setCart(response.data.data);
                calculateTotal(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            fetchCart(user.id);
        } else {
            setLoading(false);
            navigate('/login');
        }
    }, [navigate, fetchCart]); // Added fetchCart dependency

    // Add debug logs to calculateTotal
    const calculateTotal = (items) => {
        console.log('Calculating total for items:', items); // Debug log
        const sum = items.reduce((acc, item) => {
            const itemTotal = item.price * item.quantity;
            console.log(`Item ${item.name}: ${itemTotal}`); // Debug log
            return acc + itemTotal;
        }, 0);
        setTotal(sum);
    };

    // Update handleQuantityChange to include user_id
    const handleQuantityChange = async (productId, change) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        try {
            await api.post('/cart/update.php', {
                user_id: user.id,
                product_id: productId,
                change: change
            });
            fetchCart(user.id);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleCheckout = () => {
        navigate('/order');
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4">Keranjang Belanja</h2>
            {loading ? (
                <p>Loading...</p>
            ) : cart.length > 0 ? (
                <>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Produk</th>
                                <th>Harga</th>
                                <th>Jumlah</th>
                                <th>Subtotal</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={item.image 
                                                    ? `https://localhost/pertanian/server/uploads/${item.image}` 
                                                    : 'https://via.placeholder.com/50'
                                                }
                                                alt={item.name}
                                                style={{ 
                                                    width: '50px', 
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    marginRight: '10px' 
                                                }}
                                            />
                                            {item.name}
                                        </div>
                                    </td>
                                    <td>Rp {parseInt(item.price).toLocaleString()}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm"
                                                onClick={() => handleQuantityChange(item.id, -1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </Button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <Button 
                                                variant="outline-secondary" 
                                                size="sm"
                                                onClick={() => handleQuantityChange(item.id, 1)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </td>
                                    <td>Rp {(item.price * item.quantity).toLocaleString()}</td>
                                    <td>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleQuantityChange(item.id, 'remove')}
                                        >
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Card className="mt-4">
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col>
                                    <h4 className="mb-0">Total: Rp {total.toLocaleString()}</h4>
                                </Col>
                                <Col className="text-end">
                                    <Button 
                                        variant="success" 
                                        size="lg"
                                        onClick={handleCheckout}
                                    >
                                        Lanjut ke Pembayaran
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </>
            ) : (
                <div className="text-center">
                    <p>Keranjang belanja kosong</p>
                    <Button 
                        variant="success"
                        onClick={() => navigate('/marketplace')}
                    >
                        Mulai Belanja
                    </Button>
                </div>
            )}
        </Container>
    );
}

export default CartPage;