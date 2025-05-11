import React, { useEffect, useState } from 'react';
import HouseholdList from '../../../components/componentAccount/HouseholdList';
import HouseholdAccountDetail from '../../../components/componentAccount/HouseholdAccount';
import './OtherAccount2.css'; 

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHousehold, setNewHousehold] = useState({
    username: '',
    password: '',
    name: '',
    number_of_members: 0,
    room_number: '',
    phone: ''
  });

  const employeeId = getEmployeeId();

  const fetchHouseholds = () => {
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
  };

  useEffect(() => {
    if (!employeeId) {
      alert('Không thể xác định nhân viên.');
      setLoading(false);
      return;
    }
    fetchHouseholds();
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
        setSelectedHousehold({ ...data, account_id: accountId });
      })      
      .catch((err) => {
        console.error('Lỗi khi tải chi tiết hộ cư dân:', err);
        alert('Không thể tải chi tiết hộ cư dân.');
      });
  };

  const handleBackToList = () => {
    setSelectedHousehold(null);
    setLoading(true);
    fetchHouseholds(); 
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
        setSelectedHousehold((prev) => ({ ...prev, status: 'inactive' }));
      })
      .catch((err) => {
        console.error('Lỗi khi vô hiệu hóa:', err);
        alert('Đã xảy ra lỗi khi vô hiệu hóa tài khoản.');
      });
  };

  const handleAddNewHousehold = () => {
  if (!employeeId) {
    alert('Không xác định được nhân viên.');
    return;
  }

  fetch(`http://127.0.0.1:8000/staff/accounts/household?employee_id=${employeeId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newHousehold)
  })
    .then((res) => {
      if (!res.ok) throw new Error('Thêm mới thất bại');
      return res.json();
    })
    .then(() => {
      alert('Thêm mới hộ cư dân thành công!');
      setShowAddForm(false);
      setNewHousehold({
        username: '',
        password: '',
        name: '',
        number_of_members: 0,
        room_number: '',
        phone: ''
      });
      setLoading(true);
      // Cập nhật lại danh sách hộ cư dân
      fetchHouseholds();
      // Delay ngắn để đảm bảo backend đã cập nhật
      setTimeout(fetchHouseholds, 500);
    })
    .catch((err) => {
      console.error('Lỗi khi thêm mới:', err);
      alert('Không thể thêm mới hộ cư dân.');
    });
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewHousehold((prev) => ({
      ...prev,
      [name]: name === 'number_of_members' ? Number(value) : value
    }));
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      {selectedHousehold ? (
        <div>
          <button onClick={handleBackToList} className="back-btn">Quay lại danh sách</button>
          <HouseholdAccountDetail
            profile={selectedHousehold}
            onDisable={handleDisableAccount}
          />
        </div>
      ) : (
        <div>
          <button onClick={() => setShowAddForm(true)} className="add-btn">
            ➕ Thêm mới hộ cư dân
          </button>
          <HouseholdList
            title="Danh sách hộ cư dân"
            households={households}
            onRowClick={handleSelectHousehold}
          />

          {showAddForm && (
            <div className="modal-1">
              <div className="modal-1-content">
                <h3>Thêm mới hộ cư dân</h3>
                <input name="username" placeholder="Tên đăng nhập" value={newHousehold.username} onChange={handleChange} />
                <input name="password" placeholder="Mật khẩu" type="password" value={newHousehold.password} onChange={handleChange} />
                <input name="name" placeholder="Tên chủ hộ" value={newHousehold.name} onChange={handleChange} />
                <input name="number_of_members" type="number" placeholder="Số thành viên" value={newHousehold.number_of_members} onChange={handleChange} />
                <input name="room_number" placeholder="Số phòng" value={newHousehold.room_number} onChange={handleChange} />
                <input name="phone" placeholder="Số điện thoại" value={newHousehold.phone} onChange={handleChange} />
                <div className="modal-1-buttons">
                  <button onClick={handleAddNewHousehold}>Lưu</button>
                  <button onClick={() => setShowAddForm(false)}>Hủy</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OtherAccount2;
