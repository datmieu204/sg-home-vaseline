import React, { useEffect, useState } from 'react';
import Account from '../../../components/componentAccount/Account';

const StaffAccount2 = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (!userData) {
      alert('Không có thông tin người dùng trong localStorage.');
      setLoading(false);
      return;
    }

    const user = JSON.parse(userData);
    const employeeId = user?.user_id;

    if (!employeeId) {
      alert('Không tìm thấy mã nhân viên.');
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/staff/profile?employee_id=${employeeId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể lấy dữ liệu');
        return res.json();
      })
      .then((data) => {
        if (!data || Object.keys(data).length === 0) {
          alert('Không tìm thấy dữ liệu tài khoản.');
        } else {
          setProfile(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi gọi API:', err);
        alert('Đã xảy ra lỗi khi lấy dữ liệu tài khoản.');
        setLoading(false);
      });
  }, []);

  const handleUpdate = (updateData) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const employeeId = user?.user_id;

    fetch(`http://127.0.0.1:8000/staff/profile?employee_id=${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Không thể cập nhật');
        return res.json();
      })
      .then((data) => {
        alert('Cập nhật thành công!');
        setProfile(data);
      })
      .catch((err) => {
        console.error('Lỗi khi cập nhật:', err);
        alert('Không thể cập nhật tài khoản.');
      });
  };

  if (loading) return <div className="loading-spinner">Đang tải dữ liệu...</div>;
  if (!profile) return <p>Không tìm thấy dữ liệu tài khoản.</p>;

  return (
    <div>
      <Account profile={profile} onConfirm={handleUpdate} />
    </div>
  );
};

export default StaffAccount2;
