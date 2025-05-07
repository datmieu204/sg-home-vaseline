import React, { useEffect, useState } from 'react';
import EmployeeList from '../../../components/componentAccount/EmployeeList';
import OtherAccount from '../../../components/componentAccount/OtherAccount';
import './ManagerOtherAccount1.css';

const ManagerOtherAccount1 = () => {
  const [staffs, setStaffs] = useState([]);
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
        setStaffs(Array.isArray(data) ? data : []);
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

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      {selectedStaff ? (
        <div>
          <button onClick={handleBackToList} className="back-btn">Quay lại danh sách</button>
          <OtherAccount profile={selectedStaff} />
        </div>
      ) : (
        <>
          <div className="header-actions">
            <h2>Danh sách nhân viên dưới quyền</h2>
            <div className="button-wrapper">
              <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Thêm mới</button>
            </div>
          </div>


          <EmployeeList
            title=""
            employees={staffs}
            onRowClick={handleSelectStaff}
          />

          {showAddModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Thêm nhân viên mới</h3>
                <input type="text" placeholder="Họ tên" value={newStaff.employee_name}
                  onChange={(e) => setNewStaff({ ...newStaff, employee_name: e.target.value })} />
                <input type="text" placeholder="Số điện thoại" value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} />
                <input type="text" placeholder="Địa chỉ" value={newStaff.address}
                  onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })} />
                <input type="date" placeholder="Ngày bắt đầu" value={newStaff.begin_date}
                  onChange={(e) => setNewStaff({ ...newStaff, begin_date: e.target.value })} />
                <input type="text" placeholder="Tên đăng nhập" value={newStaff.username}
                  onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })} />
                <input type="password" placeholder="Mật khẩu" value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })} />

                <div className="modal-actions">
                  <button onClick={handleAddNewStaff}>Lưu</button>
                  <button onClick={() => setShowAddModal(false)}>Hủy</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManagerOtherAccount1;
