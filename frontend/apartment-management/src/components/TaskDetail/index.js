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
  FaProjectDiagram,
  FaCheckCircle 
} from 'react-icons/fa';

const TaskDetail = ({ task, onBack, updateTaskStatus, showStatusUpdateButton }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);  
  

  useEffect(() => {
    if (task) {
      setIsVisible(true);
      setCurrentTask(task);
    }
  }, [task]);

  if (!currentTask) return null;

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

  const getStatusClass = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'in_progress': return 'status-in-progress';
      default: return 'status-pending';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'Hoàn thành';
      case 'in_progress': return 'Đang xử lý';
      default: return 'Chưa bắt đầu';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <FaCheck />;
      case 'in_progress': return <FaSpinner className="fa-spin" />;
      default: return <FaHourglassStart />;
    }
  };

  const getRemainingTime = () => {
    const deadline = new Date(currentTask.deadline);
    const now = new Date();
    
    if (currentTask.status === 'completed') return 'Đã hoàn thành';
    if (deadline < now) return 'Đã quá hạn';
    
    const diffTime = Math.abs(deadline - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 0 ? 'Hạn hôm nay' : `Còn ${diffDays} ngày`;
  };

  const getRemainingTimeClass = () => {
    if (currentTask.status === 'completed') return 'completed';
    
    const deadline = new Date(currentTask.deadline);
    const now = new Date();
    if (deadline < now) return 'overdue';
    
    const diffTime = Math.abs(deadline - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'urgent';
    if (diffDays <= 3) return 'warning';
    return 'normal';
  };

  const handleStatusChange = (status) => {
    updateTaskStatus(currentTask.task_id, status);
    setCurrentTask(prev => ({ ...prev, status }));
  };

  // Function to handle confirming completion
  const handleConfirmCompletion = () => {
    setShowConfirmPopup(true);
  };

  // Function to handle confirmation in the popup
  const confirmCompletion = () => {
    handleStatusChange('completed');
    setShowConfirmPopup(false);  // Close the popup after confirmation
  };

  // Function to handle cancelling the popup
  const cancelCompletion = () => {
    setShowConfirmPopup(false);  // Close the popup
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
          {currentTask.name_task}
        </h1>
        <div className={`task-status ${getStatusClass(currentTask.status)}`}>
          {getStatusIcon(currentTask.status)} {getStatusLabel(currentTask.status)}
        </div>
      </div>
      
      {currentTask.status === 'in_progress' && showStatusUpdateButton  && (
        <div className="status-update">
          <button 
            className="complete-button" 
            onClick={handleConfirmCompletion}
          >
            <FaCheckCircle /> Xác nhận hoàn thành
          </button>
        </div>
      )}

      {/* Confirmation Popup */}
      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup-content-dt">
            <h3>Xác nhận hoàn thành nhiệm vụ</h3>
            <p>Bạn có chắc chắn muốn đánh dấu nhiệm vụ này là hoàn thành?</p>
            <div className="popup-buttons">
              <button className="confirm-button" onClick={confirmCompletion}>Xác nhận</button>
              <button className="cancel-button" onClick={cancelCompletion}>Hủy</button>
            </div>
          </div>
        </div>
      )}

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
              {currentTask.description || 'Không có mô tả cho công việc này.'}
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
            <p>{currentTask.assigner_id}</p>
          </div>
          
          <div className="sidebar-card fade-in-slide delay-5 hover-card">
            <div className="card-header">
              <div className="detail-icon"><FaUser /></div>
              <h4>Người thực hiện</h4>
            </div>
            <p>{currentTask.assignee_id}</p>
          </div>
          
          <div className="sidebar-card fade-in-slide delay-6 hover-card">
            <div className="card-header">
              <div className="detail-icon"><FaCalendarAlt /></div>
              <h4>Thời gian giao</h4>
            </div>
            <p>{formatDate(currentTask.assigned_time)}</p>
          </div>
          
          <div className="sidebar-card fade-in-slide delay-7 hover-card">
            <div className="card-header">
              <div className="detail-icon"><FaClock /></div>
              <h4>Hạn chót</h4>
            </div>
            <p>{formatDate(currentTask.deadline)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
