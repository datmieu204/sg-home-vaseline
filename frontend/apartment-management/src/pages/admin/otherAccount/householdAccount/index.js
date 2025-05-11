// src/pages/admin/accounts/HouseholdAccount.js
import React, { useEffect, useState } from 'react';
import HouseholdList from '../../../../components/componentAccount/HouseholdList';
import HouseholdAccountDetail from '../../../../components/componentAccount/HouseholdAccount';


const HouseholdAccount = () => {
  const [households, setHouseholds] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy danh sách hộ cư dân
    fetch('http://127.0.0.1:8000/admin/accounts/households')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải dữ liệu');
        return res.json();
      })
      .then((data) => {
        setHouseholds(data.accounts);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        setLoading(false);
      });
  }, []);

    const handleSelectHousehold = (accountId) => {
        fetch(`http://127.0.0.1:8000/admin/accounts/households/${accountId}`).then((res) => {
        if (!res.ok) throw new Error('Không thể tải chi tiết');
        return res.json();
        })
        .then((data) => {
            if (data.account.status === 'inactive') {
            alert('Tài khoản cư dân đã bị vô hiệu hóa.');
            return;
        }
        setSelectedHousehold(data.account);
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
  
    fetch(`http://127.0.0.1:8000/admin/accounts/households/${selectedHousehold.account_id}/disable`, {
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
      .then((data) => {
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
          <HouseholdAccountDetail profile={selectedHousehold} onDisable={handleDisableAccount} />
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

export default HouseholdAccount;
