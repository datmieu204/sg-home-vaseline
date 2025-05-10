import React, { useEffect, useState } from 'react';
import EmployeeList from '../../../components/componentAccount/EmployeeList';
import OtherAccount from '../../../components/componentAccount/OtherAccount';
import SearchBar from '../../../components/SearchBar/SearchBar';
import './ManagerOtherAccount1.css';

const ManagerOtherAccount1 = () => {
  const [staffs, setStaffs] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    employee_name: '',
    phone: '',
    address: '',
    begin_date: '',
    username: '',
    password: '',
  });

  const getManagerId = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    try {
      const user = JSON.parse(userData);
      return user?.user_id || null;
    } catch {
      return null;
    }
  };

  const fetchStaffs = () => {
    const managerId = getManagerId();
    if (!managerId) return;
    fetch(`http://127.0.0.1:8000/manager/accounts/staffs?employee_id=${managerId}`)
      .then((res) => res.json())
      .then((data) => {
        const staffsList = Array.isArray(data) ? data : [];
        setStaffs(staffsList);
        setFilteredStaffs(staffsList);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách nhân viên:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleSearch = (term) => {
    if (!term || !term.trim()) {
      setFilteredStaffs(staffs);
      return;
    }
    
    const filtered = staffs.filter(staff => 
      (staff.employee_name && staff.employee_name.toLowerCase().includes(term.toLowerCase())) || 
      (staff.phone && staff.phone.includes(term)) ||
      (staff.username && staff.username.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredStaffs(filtered);
  };

  const handleSelectStaff = (accountId) => {
    const managerId = getManagerId();
    if (!managerId) return;

    fetch(`http://127.0.0.1:8000/manager/accounts/staffs/${accountId}?manager_id=${managerId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải chi tiết nhân viên');
        return res.json();
      })
      .then((data) => {
        if (data.status === 'inactive') {
          alert('Tài khoản đã bị vô hiệu hóa.');
          return;
        }
        setSelectedStaff(data);
      })
      .catch((err) => {
        console.error('Lỗi khi tải chi tiết nhân viên:', err);
        alert('Không thể xem chi tiết nhân viên.');
      });
  };

  const handleDisableStaff = () => {
    if (!selectedStaff) return;
  
    const confirm = window.confirm("Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?");
    if (!confirm) return;
  
    const managerId = getManagerId();
    if (!managerId) return;

    fetch(`http://127.0.0.1:8000/manager/accounts/staffs/${selectedStaff.employee_id}/disable?manager_id=${managerId}`, {
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
        setSelectedStaff((prev) => ({
          ...prev,
          status: 'inactive'
        }));
      })
      .catch((err) => {
        console.error('Lỗi khi vô hiệu hóa:', err);
        alert('Đã xảy ra lỗi khi vô hiệu hóa tài khoản.');
      });
  };

  const handleAddNewStaff = () => {
    const managerId = getManagerId();
    if (!managerId) return;

    fetch(`http://127.0.0.1:8000/manager/accounts/staffs?employee_id=${managerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStaff),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Không thể thêm nhân viên');
        return res.json();
      })
      .then(() => {
        alert('Thêm nhân viên thành công!');
        setShowAddModal(false);
        setNewStaff({
          employee_name: '',
          phone: '',
          address: '',
          begin_date: '',
          username: '',
          password: '',
        });
        fetchStaffs();
      })
      .catch((err) => {
        console.error('Lỗi khi thêm nhân viên:', err);
        alert('Không thể thêm nhân viên mới.');
      });
  };

  const handleBackToList = () => {
    setSelectedStaff(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({
      ...newStaff,
      [name]: value
    });
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="emp-account-container-for-manager">
      {selectedStaff ? (
        <div>
          <button onClick={handleBackToList} className="back-btn">
            Quay lại danh sách
          </button>
          <OtherAccount profile={selectedStaff} onDisable={handleDisableStaff} />
        </div>
      ) : (
        <div>
          <div className="manager-header">
            <div className="search-container">
              <SearchBar 
                placeholder="Tìm kiếm nhân viên..." 
                onSearch={handleSearch} 
              />
            </div>
            
            <button onClick={() => setShowAddModal(true)} className="add-staff-btn">
              Thêm nhân viên mới
            </button>
          </div>
          
          <div className="emp-list-section">
            <div className="section-header">
              <span className="dropdown-icon">▼</span>
              <h2 className="table-title">Danh sách nhân viên dưới quyền</h2>
            </div>
            
            <EmployeeList
              employees={filteredStaffs}
              onRowClick={handleSelectStaff}
            />
          </div>
        </div>
      )}

      {/* Modal Form Thêm mới Nhân viên */}
      {showAddModal && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>Thêm nhân viên mới</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <label>Họ tên:</label>
                <input
                  type="text"
                  name="employee_name"
                  value={newStaff.employee_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  value={newStaff.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Địa chỉ:</label>
                <input
                  type="text"
                  name="address"
                  value={newStaff.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Ngày bắt đầu:</label>
                <input
                  type="date"
                  name="begin_date"
                  value={newStaff.begin_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Tên đăng nhập:</label>
                <input
                  type="text"
                  name="username"
                  value={newStaff.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Mật khẩu:</label>
                <input
                  type="password"
                  name="password"
                  value={newStaff.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="popup-buttons">
                <button type="button" onClick={handleAddNewStaff}>Lưu</button>
                <button type="button" onClick={() => setShowAddModal(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerOtherAccount1;