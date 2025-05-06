import React, { useState, useEffect } from 'react';
import './ServiceList.css';
import ServiceItem from '../ServiceItem/ServiceItem';
import MyServiceItem from '../MyServiceItem/MyServiceItem';

const ServiceList = () => {
  const [activeTab, setActiveTab] = useState('register'); // 'register' or 'myServices'
  const [services, setServices] = useState([]);
  const [myServices, setMyServices] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch services from an API
    const mockServices = [
      {
        id: 1,
        title: 'Đăng ký vé tháng bể bơi',
        description: 'Dịch vụ bể bơi tại chung cư mang đến không gian thư giãn, rèn luyện sức khỏe và gắn kết cộng đồng cho cư dân. Bể bơi được thiết kế hiện đại, đạt tiêu chuẩn Olympic với hệ thống lọc nước tiên tiến, đảm bảo chất lượng nước luôn sạch sẽ và an toàn cho người sử dụng.',
        cost: '500,000 VND/người/tháng',
        duration: '30 ngày',
        availability: '5:30 - 22:00 hàng ngày',
        requirements: {
          maxRegistrations: '5 người/hộ'
        },
        benefits: [
          'Sử dụng không giới hạn trong giờ mở cửa',
          'Được tham gia các lớp dạy bơi miễn phí vào cuối tuần',
          'Được sử dụng phòng thay đồ và tủ khóa riêng',
          'Giảm 10% khi đăng ký từ 3 tháng trở lên'
        ]
      },
      {
        id: 2,
        title: 'Đăng ký vé tháng tập Gym',
        description: 'Phòng tập Gym hiện đại với đầy đủ trang thiết bị tập luyện tiên tiến, đáp ứng mọi nhu cầu từ người mới bắt đầu đến người tập chuyên nghiệp. Không gian thoáng đãng, được thiết kế khoa học giúp tối ưu trải nghiệm tập luyện. Đội ngũ huấn luyện viên chuyên nghiệp sẵn sàng hỗ trợ bạn đạt được mục tiêu sức khỏe.',
        cost: '600,000 VND/người/tháng',
        duration: '30 ngày',
        availability: '5:30 - 22:00 hàng ngày',
        requirements: {
          maxRegistrations: '3 người/hộ'
        },
        benefits: [
          'Sử dụng tất cả các thiết bị tập luyện',
          'Được tham gia các lớp tập theo nhóm theo lịch',
          'Được tư vấn lịch tập và chế độ dinh dưỡng',
          'Giảm 15% khi đăng ký từ 6 tháng trở lên'
        ]
      },
      {
        id: 3,
        title: 'Đăng ký vé tháng sân bóng',
        description: 'Sân bóng đá mini với mặt cỏ nhân tạo chất lượng cao, đảm bảo độ êm và an toàn cho người chơi. Hệ thống chiếu sáng hiện đại cho phép sử dụng vào buổi tối. Khu vực khán đài rộng rãi, phòng thay đồ tiện nghi và khu vực nghỉ ngơi sau khi thi đấu. Đặc biệt có dịch vụ tổ chức giải đấu nội bộ cho cộng đồng cư dân.',
        cost: '800,000 VND/đội/tháng',
        duration: '30 ngày (8 buổi/tháng)',
        availability: '6:00 - 22:00 hàng ngày',
        requirements: {
          maxRegistrations: '1 đội/hộ (10-12 người)'
        },
        benefits: [
          'Đặt sân cố định 2 buổi/tuần',
          'Được cung cấp bóng và áo tập',
          'Miễn phí nước uống mỗi buổi tập',
          'Ưu tiên đăng ký tham gia các giải đấu do ban quản lý tổ chức'
        ]
      }
    ];

    const mockMyServices = [
      {
        id: 1,
        title: 'Vé tháng bể bơi',
        registerDate: '01/01/2025',
        endDate: '01/01/2026',
        quantity: 3,
      },
      {
        id: 2,
        title: 'Vé tháng phòng Gym',
        registerDate: '01/01/2025',
        endDate: '01/01/2026',
        quantity: 3,
      },
      {
        id: 3,
        title: 'Vé tháng sân bóng',
        registerDate: '01/01/2025',
        endDate: '01/01/2026',
        quantity: 3,
      },
    ];
    
    setServices(mockServices);
    setMyServices(mockMyServices);
  }, []);

  return (
    <div className="service-page">
      <div className="service-container">
        <div className="service-tabs">
          <button 
            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Đăng ký dịch vụ
          </button>
          <button 
            className={`tab-button ${activeTab === 'myServices' ? 'active' : ''}`}
            onClick={() => setActiveTab('myServices')}
          >
            Dịch vụ của tôi
          </button>
        </div>
        
        <div className="service-content">
          {activeTab === 'register' ? (
            <div className="service-list">
              {services.map(service => (
                <ServiceItem 
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          ) : (
            <div className="my-service-list">
              {myServices.map(service => (
                <MyServiceItem 
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;