import React from 'react';

const AdminLayout = ({ children }) => (
  <div className="admin-layout">
    <header style={{ backgroundColor: '#000', color: '#fff', padding: '1rem' }}>
      <h2>Admin Panel</h2>
    </header>
    <main style={{ padding: '1rem' }}>{children}</main>
  </div>
);

export default AdminLayout;
