import React, { useEffect, useState } from 'react';
import EmployeeList from '../../../../components/componentAccount/EmployeeList';
import OtherAccount from '../../../../components/componentAccount/OtherAccount';
import SearchBar from '../../../../components/SearchBar/SearchBar';
import './ManagerAccount.css'; 

const ManagerAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [newManager, setNewManager] = useState({
    employee_name: '',
    department_id: 'ACCT',
    username: '',
    password: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    // Lấy danh sách tài khoản Manager
    fetch('http://127.0.0.1:8000/admin/accounts/managers')
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
      (account.username && account.username.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredAccounts(filtered);
  };

  const handleDisableAccount = () => {
    if (!selectedAccount) return;
  
    const confirm = window.confirm("Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?");
    if (!confirm) return;
  
    fetch(`http://127.0.0.1:8000/admin/accounts/managers/${selectedAccount.account_id}/disable`, {
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
    fetch(`http://127.0.0.1:8000/admin/accounts/managers/${accountId}`)
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

  const handleShowPopup = () => {
    setShowPopup(true); 
  };

  const handleClosePopup = () => {
    setShowPopup(false); 
    setNewManager({
      employee_name: '',
      department_id: 'ACCT',
      username: '',
      password: '',
      phone: '',
      address: ''
    }); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewManager({
      ...newManager,
      [name]: value
    });
  };

  const handleAddManager = () => {
    // Gửi request POST để thêm mới quản lý
    fetch('http://127.0.0.1:8000/admin/accounts/managers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newManager)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Không thể thêm quản lý');
        return res.json();
      })
      .then(() => {
        // Reload danh sách sau khi thêm mới thành công
        alert('Thêm quản lý thành công!');
        handleClosePopup();
        setLoading(true); // reload lại danh sách sau khi thêm mới
        fetch('http://127.0.0.1:8000/admin/accounts/managers')
          .then((res) => res.json())
          .then((data) => {
            setAccounts(data.accounts);
            setFilteredAccounts(data.accounts);
            setLoading(false);
          })
          .catch((err) => {
            console.error('Lỗi:', err);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.error('Lỗi khi thêm quản lý:', err);
        alert('Đã xảy ra lỗi khi thêm quản lý.');
      });
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
            
            <button onClick={handleShowPopup} className="add-manager-btn">
              Thêm quản lý mới
            </button>
          </div>
          
          <div className="emp-list-section">
            <div className="section-header">
              <span className="dropdown-icon">▼</span>
              <h2 className="table-title">Tất cả Trưởng Bộ phận</h2>
            </div>
            
            <EmployeeList
              employees={filteredAccounts}
              onRowClick={handleSelectAccount}
            />
          </div>
        </div>
      )}

      {/* Popup Form Thêm mới Quản lý */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>Thêm quản lý mới</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <label>Tên đầy đủ:</label>
                <input
                  type="text"
                  name="employee_name"
                  value={newManager.employee_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Chức vụ:</label>
                <input type="text" value="Manager" disabled />
              </div>
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={newManager.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Mật khẩu:</label>
                <input
                  type="password"
                  name="password"
                  value={newManager.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  value={newManager.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Địa chỉ:</label>
                <input
                  type="text"
                  name="address"
                  value={newManager.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="popup-buttons">
                <button type="button" onClick={handleAddManager}>Lưu</button>
                <button type="button" onClick={handleClosePopup}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerAccount;