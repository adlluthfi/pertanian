import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios.config';

function ProductCard({ product }) {
    const navigate = useNavigate();
    
    const handleAddToCart = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const response = await api.post('/cart/add.php', {
                user_id: user.id,
                product_id: product.id,
                quantity: 1
            });

            if (response.data.status === 'success') {
                alert('Product added to cart successfully!');
            } else {
                alert(response.data.message || 'Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart');
        }
    };

    return (
        <Card className="h-100">
            <Card.Img 
                variant="top" 
                src={`http://localhost/anyar/server/uploads/${product.image}`}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>
                    Rp {parseInt(product.price).toLocaleString()}
                </Card.Text>
                <Button 
                    variant="success" 
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;