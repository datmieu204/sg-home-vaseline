import React from 'react';

const HouseholdPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h1>Trang hộ cư dân</h1>
      <p>Xin chào: {user?.username}</p>
      <p>User ID: {user?.user_id}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
};

export default HouseholdPage;
