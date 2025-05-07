import React, { useEffect, useState } from 'react';
import Account from '../../../components/Account';

const AdminAccount = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const employeeId = user?.user_id;

  useEffect(() => {

    if (!employeeId) {
      alert("Không tìm thấy mã nhân viên.");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/admin/profile?employee_id=${employeeId}`) // corrected variable name
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch profile:', err);
        setLoading(false);
      });
  }, []);

  const handleUpdate = (formData) => {
    const updateData = {
      employee_id: profile.employee_id, // không thay đổi
      employee_name: formData.employee_name, // chỉ chỉnh sửa trường này
      username: formData.username, // chỉ chỉnh sửa trường này
      password: formData.password, // chỉ chỉnh sửa trường này
      phone: formData.phone, // chỉ chỉnh sửa trường này
      address: formData.address, // chỉ chỉnh sửa trường này
      status: 'active', // chỉ chỉnh sửa trường này (giữ trạng thái là 'active')
    };

    fetch(`http://127.0.0.1:8000/admin/profile?employee_id=${employeeId}`, {
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
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch((err) => {
        console.error('Lỗi khi cập nhật:', err);
        alert('Không thể cập nhật tài khoản.');
      });
  };

  if (loading) return <div className="loading-spinner">Đang tải...</div>;
  if (!profile) return <p>Không tìm thấy dữ liệu.</p>;

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#f28500' }}>Trang tài khoản Admin</h1>
      <Account profile={profile} onConfirm={handleUpdate} />
    </div>
  );
};

export default AdminAccount;
