import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Spin, Typography } from 'antd';

const { Text } = Typography;

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
    localStorage.clear(); // optional but safe to clear all
    navigate('/login');
  }, [dispatch, navigate]);

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        fontFamily: 'serif',
      }}
    >
      <Spin size="large" />
      <Text type="secondary" style={{ marginTop: 16 }}>
        Logging you out...
      </Text>
    </div>
  );
};

export default Logout;
