import React, { useState } from 'react';
import './TaskEditing.css';

const TaskEditing = ({ role }) => { // Nhận role từ props
  const [taskName, setTaskName] = useState('Sửa bóng đèn tầng 1 tuần 28/04/2025 - 04/05/2025');
  const [selectedDepartment, setSelectedDepartment] = useState('technical');
  const [startDate, setStartDate] = useState('2025-04-28');
  const [startTime, setStartTime] = useState('06:00');
  const [endDate, setEndDate] = useState('2025-05-04');
  const [endTime, setEndTime] = useState('18:00');
  const [assignees, setAssignees] = useState([
    { name: 'Tất cả', selected: false },
    { name: 'Nguyễn Tuấn Hưng', selected: false },
    { name: 'Nguyễn Tuấn Hưng', selected: false },
    { name: 'Nguyễn Tuấn Hưng', selected: false },
    { name: 'Nguyễn Tuấn Hưng', selected: false },
    { name: 'Nguyễn Tuấn Hưng', selected: false },
  ]);
  const [description, setDescription] = useState(
    'Do mấy thằng trẻ con nghịch hỏng đèn tầng 1, anh em nhanh chóng khắc phục sớm trả lại ánh sáng cho cư dân tầng 1.'
  );

  const handleDepartmentChange = (key) => {
    setSelectedDepartment(key);
  };

  const handleAssigneeChange = (index) => {
    if (index === 0) {
      const allSelected = !assignees[0].selected;
      const updatedAssignees = assignees.map((assignee) => ({
        ...assignee,
        selected: allSelected,
      }));
      setAssignees(updatedAssignees);
    } else {
      const updatedAssignees = [...assignees];
      updatedAssignees[index].selected = !updatedAssignees[index].selected;

      const allOthersSelected = updatedAssignees
        .slice(1)
        .every((assignee) => assignee.selected);

      updatedAssignees[0].selected = allOthersSelected;
      setAssignees(updatedAssignees);
    }
  };

  return (
    <>
      <h1 className="page-title">Sửa nhiệm vụ</h1>

      <div className="task-editing-container">
        <div className="form-group">
          <label className="section-title">Tên nhiệm vụ</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="section-title">Nhiệm vụ thuộc bộ phận</label>
          <div className="departments">
            {[
              { key: 'reception', label: 'Lễ tân' },
              { key: 'accounting', label: 'Kế toán' },
              { key: 'technical', label: 'Kỹ thuật' },
              { key: 'cleaning', label: 'Vệ sinh' },
              { key: 'security', label: 'Bảo vệ' },
            ].map((dep) => (
              <label key={dep.key} className="department-item">
                <input
                  type="radio"
                  name="department"
                  checked={selectedDepartment === dep.key}
                  onChange={() => handleDepartmentChange(dep.key)}
                />
                {dep.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group time-group">
          <div>
            <label className="section-title">Thời gian giao</label>
            <div className="time-inputs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="section-title">Hạn hoàn thành</label>
            <div className="time-inputs">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Phần Người nhận */}
        {role !== 'admin' && (
          <div className="form-group">
            <label className="section-title">Người nhận</label>
            <div className="assignees-list">
              {assignees.map((assignee, index) => (
                <label
                  key={index}
                  className={`assignee-item ${assignee.selected ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={assignee.selected}
                    onChange={() => handleAssigneeChange(index)}
                  />
                  <span className="assignee-name">{assignee.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="section-title">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="submit-button">Ghi nhận</button>
        </div>
      </div>
    </>
  );
};

export default TaskEditing;