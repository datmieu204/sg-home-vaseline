// src/pages/staff/accounts/OtherAccount2.js
import React, { useEffect, useState } from 'react';
import HouseholdList from '../../../components/componentAccount/HouseholdList';
import HouseholdAccountDetail from '../../../components/componentAccount/HouseholdAccount';

const getEmployeeId = () => {
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  try {
    const user = JSON.parse(userData);
    return user?.user_id || null;
  } catch {
    return null;
  }
};

const OtherAccount2 = () => {
  const [households, setHouseholds] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const employeeId = getEmployeeId();

  useEffect(() => {
    if (!employeeId) {
      alert('Không thể xác định nhân viên.');
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/staff/accounts/household?employee_id=${employeeId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải dữ liệu');
        return res.json();
      })
      .then((data) => {
        setHouseholds(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        setLoading(false);
      });
  }, [employeeId]);

  const handleSelectHousehold = (accountId) => {
    if (!accountId) {
      alert('Không tìm thấy account_id');
      return;
    }

    fetch(`http://127.0.0.1:8000/staff/accounts/household/${accountId}?employee_id=${employeeId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải chi tiết');
        return res.json();
      })
      .then((data) => {
        setSelectedHousehold({
          ...data,
          account_id: accountId, // gán lại account_id từ tham số
        });
      })      
      .catch((err) => {
        console.error('Lỗi khi tải chi tiết hộ cư dân:', err);
        alert('Không thể tải chi tiết hộ cư dân.');
      });
  };

  const handleBackToList = () => {
    setSelectedHousehold(null);
  };

  const handleDisableAccount = () => {
    if (!selectedHousehold) return;

    const confirm = window.confirm("Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?");
    if (!confirm) return;

    fetch(`http://127.0.0.1:8000/staff/accounts/household/${selectedHousehold.account_id}/disable?employee_id=${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'inactive' })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Không thể cập nhật trạng thái');
        return res.json();
      })
      .then(() => {
        alert('Tài khoản đã được vô hiệu hóa.');
        setSelectedHousehold((prev) => ({
          ...prev,
          status: 'inactive'
        }));
      })
      .catch((err) => {
        console.error('Lỗi khi vô hiệu hóa:', err);
        alert('Đã xảy ra lỗi khi vô hiệu hóa tài khoản.');
      });
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      {selectedHousehold ? (
        <div>
          <button onClick={handleBackToList} className="back-btn">
            Quay lại danh sách
          </button>
          <HouseholdAccountDetail
            profile={selectedHousehold}
            onDisable={handleDisableAccount}
          />
        </div>
      ) : (
        <HouseholdList
          title="Danh sách hộ cư dân"
          households={households}
          onRowClick={handleSelectHousehold}
        />
      )}
    </div>
  );
};

export default OtherAccount2;
