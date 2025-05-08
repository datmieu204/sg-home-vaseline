import React, { useEffect, useState } from 'react';
import './TaskDetail.css';
import { 
  FaArrowLeft, 
  FaUser, 
  FaCalendarAlt, 
  FaClock, 
  FaInfo, 
  FaTasks,
  FaRegClock,
  FaCheck,
  FaSpinner,
  FaHourglassStart,
  FaProjectDiagram
} from 'react-icons/fa';
import axios from 'axios';

const TaskDetail = ({ task, onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [employees, setEmployees] = useState({});
  
  useEffect(() => {
    setIsVisible(true);
    fetchEmployees();
  }, []);

  // Fetch employees from database
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      const employeeMap = {};
      
      // Create mapping from ID to employee name
      response.data.forEach(employee => {
        employeeMap[employee.id] = `${employee.first_name} ${employee.last_name}`;
      });
      
      setEmployees(employeeMap);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  if (!task) return null;

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Determine status class for styling
  const getStatusClass = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'in_progress': return 'status-in-progress';
      default: return 'status-pending';
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'Hoàn thành';
      case 'in_progress': return 'Đang xử lý';
      default: return 'Chưa bắt đầu';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <FaCheck />;
      case 'in_progress': return <FaSpinner className="fa-spin" />;
      default: return <FaHourglassStart />;
    }
  };

  // Calculate remaining time
  const getRemainingTime = () => {
    const deadline = new Date(task.deadline);
    const now = new Date();
    
    if (task.status === 'completed') return 'Đã hoàn thành';
    
    if (deadline < now) {
      return 'Đã quá hạn';
    }
    
    const diffTime = Math.abs(deadline - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hạn hôm nay';
    return `Còn ${diffDays} ngày`;
  };

  // Get remaining time class for styling
  const getRemainingTimeClass = () => {
    if (task.status === 'completed') return 'completed';
    const deadline = new Date(task.deadline);
    const now = new Date();
    if (deadline < now) return 'overdue';
    
    const diffTime = Math.abs(deadline - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'urgent';
    if (diffDays <= 3) return 'warning';
    return 'normal';
  };

  // Get employee name from ID
  const getEmployeeName = (id) => {
    return employees[id] || id || 'Không xác định';
  };

  return (
    <div className={`task-detail-container ${isVisible ? 'visible' : ''}`}>
      <div className="task-detail-header">
        <button 
          className="back-button ripple" 
          onClick={onBack}
        >
          <FaArrowLeft /> <span>Quay lại</span>
        </button>
        <h1 className="task-title-in-detail">
          {task.name_task}
        </h1>
        <div className={`task-status ${getStatusClass(task.status)}`}>
          {getStatusIcon(task.status)} {getStatusLabel(task.status)}
        </div>
      </div>
      
      <div className="task-layout">
        <div className="task-main-content">
          <div className="task-progress-wrapper fade-in-slide delay-1">
            <h3><FaProjectDiagram /> Tiến độ công việc</h3>
            <div className={`remaining-time ${getRemainingTimeClass()}`}>
              <FaRegClock /> {getRemainingTime()}
            </div>
          </div>
          
          <div className="task-description-card fade-in-slide delay-2">
            <div className="card-header">
              <FaInfo /> <h3>Mô tả công việc</h3>
            </div>
            <div className="description-content">
              {task.description || 'Không có mô tả cho công việc này.'}
            </div>
          </div>
        </div>
        
        <div className="task-sidebar">
          <h3 className="section-title fade-in-slide delay-3"><FaTasks /> Thông tin</h3>
          
          <div className="sidebar-card fade-in-slide delay-4 hover-card">
            <div className="card-header">
              <div className="detail-icon"><FaUser /></div>
              <h4>Người giao việc</h4>
            </div>
            <p>{getEmployeeName(task.assigner_id)}</p>
          </div>
          
          <div className="sidebar-card fade-in-slide delay-5 hover-card">
            <div className="card-header">
              <div className="detail-icon"><FaUser /></div>
              <h4>Người thực hiện</h4>
            </div>
            <p>{getEmployeeName(task.assignee_id)}</p>
          </div>
          
          <div className="sidebar-card fade-in-slide delay-6 hover-card">
            <div className="card-header">
              <div className="detail-icon"><FaCalendarAlt /></div>
              <h4>Thời gian giao</h4>
            </div>
            <p>{formatDate(task.assigned_time)}</p>
          </div>
          
          <div className="sidebar-card fade-in-slide delay-7 hover-card">
            <div className="card-header">
              <div className="detail-icon"><FaClock /></div>
              <h4>Hạn chót</h4>
            </div>
            <p>{formatDate(task.deadline)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;