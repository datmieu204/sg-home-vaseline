import React, { useEffect, useState } from 'react';
import Household from '../../../components/HouseholdAccount';

const Account = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tạm thời vì khôm đăng nhập được gruh
  // const user = JSON.parse(localStorage.getItem('user'));
  // const householdId = user?.user_id;

  const householdId = 'HH001';

  useEffect(() => {
    if (!householdId) {
      alert("Không tìm thấy mã hộ gia đình.");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/household/profile?household_id=${householdId}`, {
      headers: { 'Accept': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch household profile:', err);
        setLoading(false);
      });
  }, []);

  const handleUpdate = (formData) => {
    const updateData = {
      id: profile.id, // không thay đổi
      name: formData.name, // chỉ chỉnh sửa trường này
      number_of_members: formData.number_of_members, // chỉ chỉnh sửa trường này
      phone: formData.phone, // chỉ chỉnh sửa trường này
      room_number: formData.room_number, // chỉ chỉnh sửa trường này
      status: 'active' // chỉ chỉnh sửa trường này (giữ trạng thái là 'active')
    };

    fetch(`http://127.0.0.1:8000/household/profile?household_id=${householdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Cập nhật thất bại');
        return res.json();
      })
      .then((data) => {
        alert('Cập nhật thành công!');
        setProfile(data);
      })
      .catch((err) => {
        console.error('Lỗi khi cập nhật:', err);
        alert('Không thể cập nhật thông tin hộ gia đình.');
      });
  };

  if (loading) return <div className="loading-spinner">Đang tải...</div>;
  if (!profile) return <p>Không tìm thấy dữ liệu.</p>;

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#f28500' }}>Trang thông tin Hộ gia đình</h1>
      <Household profile={profile} onConfirm={handleUpdate} />
    </div>
  );
};

export default Account;