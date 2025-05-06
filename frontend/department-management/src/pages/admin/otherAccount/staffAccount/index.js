import React, { useEffect, useState } from 'react';
import EmployeeList from '../../../../components/componentAccount/EmployeeList';
import OtherAccount from '../../../../components/componentAccount/OtherAccount';

const StaffAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy danh sách tài khoản nhân viên
    fetch('http://127.0.0.1:8000/admin/accounts/staffs')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải dữ liệu');
        return res.json();
      })
      .then((data) => {
        setAccounts(data.accounts);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        setLoading(false);
      });
  }, []);

  const handleSelectAccount = (accountId) => {
    // Lấy chi tiết tài khoản nhân viên theo accountId
    fetch(`http://127.0.0.1:8000/admin/accounts/staffs/${accountId}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedAccount(data.account); // Lưu thông tin tài khoản đã chọn
      })
      .catch((err) => console.error('Lỗi khi tải chi tiết tài khoản:', err));
  };

  const handleBackToList = () => {
    setSelectedAccount(null); 
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      {selectedAccount ? (
        <div>
          <button onClick={handleBackToList} className="back-btn">
            Quay lại danh sách
          </button>
          <OtherAccount profile={selectedAccount} />
        </div>
      ) : (
        <EmployeeList
          title="Danh sách tài khoản Nhân viên"
          employees={accounts}
          onRowClick={handleSelectAccount}
        />
      )}
    </div>
  );
};

export default StaffAccount;
