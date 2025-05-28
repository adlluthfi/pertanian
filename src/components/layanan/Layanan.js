import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faChalkboardTeacher, faStore } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Layanan() {
    const navigate = useNavigate();

    return (
        <Container className="py-5">
            <h2 className="text-center mb-5">Layanan Kami</h2>
            <Row>
                <Col md={4} className="mb-4">
                    <Card className="h-100 text-center">
                        <Card.Body>
                            <FontAwesomeIcon 
                                icon={faComments} 
                                size="3x" 
                                className="text-success mb-3" 
                            />
                            <Card.Title>Konsultasi</Card.Title>
                            <Card.Text>
                                Dapatkan konsultasi langsung dengan ahli pertanian kami
                                untuk solusi masalah pertanian Anda. Tim ahli kami siap
                                membantu mengoptimalkan hasil panen Anda.
                            </Card.Text>
                            <ul className="list-unstyled text-start mb-4">
                                <li>✓ Konsultasi Online</li>
                                <li>✓ Analisis Lahan</li>
                                <li>✓ Rekomendasi Pupuk</li>
                                <li>✓ Pengendalian Hama</li>
                            </ul>
                            <Button 
                                variant="outline-success"
                                onClick={() => navigate('/konsultasi')}
                            >
                                Mulai Konsultasi
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="h-100 text-center">
                        <Card.Body>
                            <FontAwesomeIcon 
                                icon={faChalkboardTeacher} 
                                size="3x" 
                                className="text-success mb-3" 
                            />
                            <Card.Title>Pelatihan</Card.Title>
                            <Card.Text>
                                Tingkatkan pengetahuan dan keterampilan pertanian Anda
                                melalui program pelatihan yang komprehensif dari para
                                praktisi berpengalaman.
                            </Card.Text>
                            <ul className="list-unstyled text-start mb-4">
                                <li>✓ Teknik Bertani Modern</li>
                                <li>✓ Manajemen Lahan</li>
                                <li>✓ Pengolahan Hasil Panen</li>
                                <li>✓ Pertanian Organik</li>
                            </ul>
                            <Button 
                                variant="outline-success"
                                onClick={() => navigate('/pelatihan')}
                            >
                                Daftar Pelatihan
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-4">
                    <Card className="h-100 text-center">
                        <Card.Body>
                            <FontAwesomeIcon 
                                icon={faStore} 
                                size="3x" 
                                className="text-success mb-3" 
                            />
                            <Card.Title>Marketplace</Card.Title>
                            <Card.Text>
                                Temukan berbagai produk pertanian berkualitas atau
                                jual hasil panen Anda di marketplace kami dengan
                                harga yang kompetitif.
                            </Card.Text>
                            <ul className="list-unstyled text-start mb-4">
                                <li>✓ Jual Beli Hasil Panen</li>
                                <li>✓ Alat Pertanian</li>
                                <li>✓ Bibit Unggul</li>
                                <li>✓ Pupuk & Nutrisi</li>
                            </ul>
                            <Button 
                                variant="outline-success"
                                onClick={() => navigate('/marketplace')}
                            >
                                Kunjungi Marketplace
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Layanan;