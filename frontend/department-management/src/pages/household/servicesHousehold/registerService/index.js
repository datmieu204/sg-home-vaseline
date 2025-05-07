import React, { useState, useEffect } from 'react';
import './registerService.css';

const ServicesList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [quantity, setQuantity] = useState(1); // New state for quantity

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/household/services', {
                    headers: {
                        Accept: 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }
                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const fetchServiceDetails = async (serviceId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/household/services/get/${serviceId}`, {
                headers: {
                    Accept: 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch service details');
            }
            const data = await response.json();
            setSelectedService(data);
        } catch (error) {
            console.error('Error fetching service details:', error);
            alert('Không thể tải chi tiết dịch vụ.');
        }
    };

    const handleDetails = (serviceId) => {
        fetchServiceDetails(serviceId);
    };

    const handleBack = () => {
        setSelectedService(null);
        setQuantity(1); // Reset quantity when going back
    };

    const handleRegister = () => {
        // Logic for registering the service with the selected quantity
        alert(`Đã đăng ký dịch vụ: ${selectedService.service_name} với số lượng: ${quantity}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!services || services.length === 0) {
        return <p>Không có dịch vụ nào.</p>;
    }

    return (
        <div className="services-container">
            {selectedService ? (
                <div className="service-details-content">
                    <h2 className="service-details-title">Chi tiết dịch vụ: {selectedService.service_name}</h2>
                    <p><strong>Tên dịch vụ:</strong> {selectedService.service_name}</p>
                    <p><strong>Giá:</strong> {selectedService.price} (triệu đồng/tháng)</p>
                    <p><strong>Trạng thái:</strong> {selectedService.status === 'active' ? 'Đang mở' : 'Đã đóng'}</p>
                    <p><strong>Mô tả:</strong> {selectedService.description}</p>
                    <div className="quantity-input">
                        <label htmlFor="quantity"><strong>Số lượng:</strong></label>
                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>
                    <div className="service-details-actions">
                        <button className="back-btn" onClick={handleBack}>Trở về</button>
                        <button className="register-btn" onClick={handleRegister}>Đăng ký</button>
                    </div>
                </div>
            ) : (
                <div className="services-list">
                    {services.map((service) => (
                        <div className="service-item" key={service.service_id}>
                            <div className="service-content">
                                <h3 className="service-title">{service.service_name}</h3>
                                <p className="service-description">
                                    <strong>Mô tả:</strong> {service.description} <br />
                                </p>
                            </div>
                            <div className="service-actions">
                                <button className="detail-btn" onClick={() => handleDetails(service.service_id)}>
                                    Chi tiết
                                </button>
                                <button className="register-btn" onClick={() => handleDetails(service.service_id)}>
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServicesList;