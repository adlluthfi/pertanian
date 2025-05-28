import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

function Contact() {
    return (
        <Container className="py-5">
            <h2 className="text-center mb-4">Hubungi Kami</h2>
            <Row>
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <h4 className="mb-4">Informasi Kontak</h4>
                            
                            <div className="d-flex align-items-center mb-3">
                                <FaMapMarkerAlt className="text-success me-3" size={24} />
                                <div>
                                    <h6 className="mb-0">Alamat</h6>
                                    <p className="mb-0">Jl. Raya Soreang-Banjaran No.KM. 3, Pamekaran, Kec. Soreang, Kabupaten Bandung, Jawa Barat 40912</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <FaPhone className="text-success me-3" size={24} />
                                <div>
                                    <h6 className="mb-0">Telepon</h6>
                                    <p className="mb-0">(0234) 123456</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <FaWhatsapp className="text-success me-3" size={24} />
                                <div>
                                    <h6 className="mb-0">WhatsApp</h6>
                                    <p className="mb-0">+12 345-6789-7890</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <FaEnvelope className="text-success me-3" size={24} />
                                <div>
                                    <h6 className="mb-0">Email</h6>
                                    <p className="mb-0">indofarm@pertanian.com</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <h4 className="mb-4">Jam Operasional</h4>
                            <div className="mb-3">
                                <h6>Senin - Jumat</h6>
                                <p>08:00 - 16:00 WIB</p>
                            </div>
                            <div className="mb-3">
                                <h6>Sabtu</h6>
                                <p>08:00 - 13:00 WIB</p>
                            </div>
                            <div>
                                <h6>Minggu & Hari Libur</h6>
                                <p>Tutup</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Contact;