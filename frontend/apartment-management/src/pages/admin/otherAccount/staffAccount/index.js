import React, { useEffect, useState } from 'react';
import EmployeeList from '../../../../components/componentAccount/EmployeeList';
import OtherAccount from '../../../../components/componentAccount/OtherAccount';
import SearchBar from '../../../../components/SearchBar/SearchBar';

const StaffAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
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
        setFilteredAccounts(data.accounts);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi:', err);
        setLoading(false);
      });
  }, []);

  const handleSearch = (term) => {
    if (!term || !term.trim()) {
      setFilteredAccounts(accounts);
      return;
    }
    
    const filtered = accounts.filter(account => 
      (account.employee_name && account.employee_name.toLowerCase().includes(term.toLowerCase())) || 
      (account.username && account.username.toLowerCase().includes(term.toLowerCase())) ||
      (account.department_id && account.department_id.toLowerCase().includes(term.toLowerCase())) ||
      (account.employee_id && account.employee_id.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredAccounts(filtered);
  };

  const handleDisableAccount = () => {
    if (!selectedAccount) return;
  
    const confirm = window.confirm("Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?");
    if (!confirm) return;
  
    fetch(`http://127.0.0.1:8000/admin/accounts/staffs/${selectedAccount.account_id}/disable`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'inactive' })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Không thể cập nhật trạng thái');
        return res.json();
      })
      .then(() => {
        alert('Tài khoản đã được vô hiệu hóa.');
        setSelectedAccount((prev) => ({
          ...prev,
          status: 'inactive'
        }));
      })
      .catch((err) => {
        console.error('Lỗi khi vô hiệu hóa:', err);
        alert('Đã xảy ra lỗi khi vô hiệu hóa tài khoản.');
      });
  };
  
  const handleSelectAccount = (accountId) => {
    fetch(`http://127.0.0.1:8000/admin/accounts/staffs/${accountId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải chi tiết');
        return res.json();
      })
      .then((data) => {
        if (data.account.status === 'inactive') {
          alert('Tài khoản đã bị vô hiệu hóa.');
          return;
        }
        setSelectedAccount(data.account);
      })
      .catch((err) => {
        console.error('Lỗi khi tải chi tiết tài khoản:', err);
        alert('Không thể xem chi tiết tài khoản.');
      });
  };
  
  const handleBackToList = () => {
    setSelectedAccount(null); 
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="emp-account-container">
      {selectedAccount ? (
        <div>
          <button onClick={handleBackToList} className="back-btn">
            Quay lại danh sách
          </button>
          <OtherAccount profile={selectedAccount} onDisable={handleDisableAccount} />
        </div>
      ) : (
        <div>
          <div className="manager-header">
            <div className="search-container">
              <SearchBar 
                placeholder="Tìm kiếm theo tên..." 
                onSearch={handleSearch} 
              />
            </div>
          </div>
          
          <div className="emp-list-section">
            <div className="section-header">
              <span className="dropdown-icon">▼</span>
              <h2 className="table-title">Tất cả Nhân viên</h2>
            </div>
            
            <EmployeeList
              employees={filteredAccounts}
              onRowClick={handleSelectAccount}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAccount;