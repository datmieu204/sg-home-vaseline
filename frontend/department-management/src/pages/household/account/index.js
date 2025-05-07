import React, { useEffect, useState } from 'react';
import Household from '../../../components/HouseholdAccount';

const Account = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
      id: profile.id,
      name: formData.name,
      number_of_members: formData.number_of_members,
      phone: formData.phone,
      room_number: formData.room_number,
      status: 'active',
      account: formData.account,
      username: formData.username,
      password: formData.password
    };

    fetch(`http://127.0.0.1:8000/household/profile/modify?household_id=${householdId}`, {
      method: 'PATCH',
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