import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import api from '../../utils/axios.config';  // Add this import
import { BsCart3 } from 'react-icons/bs';

function Marketplace() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [user, setUser] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all'); // Change default to 'all'
    const [products, setProducts] = useState({ all: [], alat: [], pupuk: [], bibit: [] }); // Add 'all' category
    const [loading, setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: 'alat',
        stock: '',
        image: null
    });
    const [cartMessage, setCartMessage] = useState('');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products/products.php');
            
            if (response.data.data) {
                // Create all products array first
                const allProducts = [
                    ...(response.data.data.alat || []),
                    ...(response.data.data.pupuk || []),
                    ...(response.data.data.bibit || [])
                ];

                const groupedProducts = {
                    all: allProducts,
                    alat: response.data.data.alat || [],
                    pupuk: response.data.data.pupuk || [],
                    bibit: response.data.data.bibit || []
                };
                
                setProducts(prevProducts => ({
                    ...prevProducts,
                    ...groupedProducts
                }));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch user data
    useEffect(() => {
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
            setUser(JSON.parse(loggedUser));
        }
    }, []);

    // Fetch products data
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            // Create FormData object
            const formData = new FormData();
            
            // Append all fields with proper type conversion
            formData.append('name', String(newProduct.name).trim());
            formData.append('description', String(newProduct.description).trim());
            formData.append('price', Number(newProduct.price));
            formData.append('category', String(newProduct.category).trim());
            formData.append('stock', Number(newProduct.stock));
            
            // Only append image if it exists
            if (newProduct.image instanceof File) {
                formData.append('image', newProduct.image);
            }

            // Log formData contents for debugging
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await api.post('/products/products.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });

            if (response.data.status === 'success') {
                // Clear form
                setNewProduct({
                    name: '',
                    description: '',
                    price: '',
                    category: 'alat',
                    stock: '',
                    image: null
                });
                
                // Close modal first
                setShowAddProduct(false);
                
                // Then fetch fresh data
                await fetchProducts();
                
                // Show success message
                alert('Produk berhasil ditambahkan');
            } else {
                throw new Error(response.data.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert(
                error.response?.data?.message || 
                error.message || 
                'Failed to add product. Please try again.'
            );
        }
    };

    // Update image handler to validate file
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPG, PNG, or GIF)');
                e.target.value = ''; // Clear the input
                return;
            }
            // Validate file size (e.g., 5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should not exceed 5MB');
                e.target.value = ''; // Clear the input
                return;
            }
            setNewProduct({
                ...newProduct,
                image: file
            });
        }
    };

    const handleAddToCart = async (product) => {
        if (!user) {
            setShowLogin(true);
            return;
        }

        try {
            const response = await api.post('/cart/add.php', {
                user_id: user.id,
                product_id: product.id,
                quantity: 1
            });

            if (response.data.status === 'success') {
                setCartMessage('Produk berhasil ditambahkan ke keranjang');
                setTimeout(() => setCartMessage(''), 3000);
            } else {
                setCartMessage(response.data.message || 'Gagal menambahkan produk ke keranjang');
                setTimeout(() => setCartMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            setCartMessage('Gagal menambahkan produk ke keranjang');
            setTimeout(() => setCartMessage(''), 3000);
        }
    };

    return (
        <>
            <Container className="py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Marketplace Pertanian</h2>
                    {user && (
                        <Button variant="success" onClick={() => setShowAddProduct(true)}>
                            Tambah Produk
                        </Button>
                    )}
                </div>

                <Nav variant="tabs" className="mb-4">
                    <Nav.Item>
                        <Nav.Link 
                            active={activeCategory === 'all'} 
                            onClick={() => setActiveCategory('all')}
                        >
                            Semua Kategori
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link 
                            active={activeCategory === 'alat'} 
                            onClick={() => setActiveCategory('alat')}
                        >
                            Alat Pertanian
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link 
                            active={activeCategory === 'pupuk'} 
                            onClick={() => setActiveCategory('pupuk')}
                        >
                            Pupuk
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link 
                            active={activeCategory === 'bibit'} 
                            onClick={() => setActiveCategory('bibit')}
                        >
                            Bibit
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                {cartMessage && (
                    <Alert 
                        variant="success" 
                        className="position-fixed top-0 start-50 translate-middle-x mt-3"
                    >
                        {cartMessage}
                    </Alert>
                )}

                <Row className="row-cols-1 row-cols-md-3 g-4">
                    {loading ? (
                        <Col className="text-center">
                            <p>Loading products...</p>
                        </Col>
                    ) : products[activeCategory]?.length > 0 ? (
                        products[activeCategory].map(product => (
                            <Col key={product.id}>
                                <Card className="h-100">
                                    <Card.Img 
                                        variant="top" 
                                        src={product.image 
                                            ? `https://localhost/pertanian/server/uploads/${product.image}` 
                                            : 'https://via.placeholder.com/300x200'
                                        }
                                        alt={product.name}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title>{product.name}</Card.Title>
                                        <div className="mb-3">
                                            {product.description}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Stock:</strong> {product.stock}
                                        </div>
                                        <div className="mt-auto">
                                            <div className="mb-3">
                                                <span className="h5 text-success">
                                                    Rp {parseInt(product.price).toLocaleString()}
                                                </span>
                                            </div>
                                            {/* Full width button for better alignment */}
                                            <Button 
                                                variant="success"
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.stock === 0}
                                                className="w-100"
                                            >
                                                {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col className="text-center">
                            <p>Tidak ada produk dalam kategori ini</p>
                        </Col>
                    )}
                </Row>

                {/* Add Product Modal */}
                <Modal show={showAddProduct} onHide={() => setShowAddProduct(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Tambah Produk Baru</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleAddProduct}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nama Produk</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Deskripsi</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Harga</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Kategori</Form.Label>
                                <Form.Select
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                    required
                                >
                                    <option value="alat">Alat Pertanian</option>
                                    <option value="pupuk">Pupuk</option>
                                    <option value="bibit">Bibit</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Stok</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Gambar Produk</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </Form.Group>

                            <Button variant="success" type="submit" className="w-100">
                                Tambah Produk
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} />
            </Container>

            {/* Floating Cart Button */}
            <div 
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    zIndex: 1000
                }}
            >
                <Button
                    variant="success"
                    size="lg"
                    className="rounded-circle shadow d-flex align-items-center justify-content-center"
                    style={{
                        width: '60px',
                        height: '60px'
                    }}
                    onClick={() => navigate('/cart')}
                >
                    <BsCart3 size={24} />
                </Button>
            </div>
        </>
    );
}

export default Marketplace;