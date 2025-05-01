import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { handleError, handleSuccess } from '../utils/utils.jsx';

const { Title, Text, Paragraph, Link } = Typography;
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_API_BASEURL;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user._id);
        localStorage.setItem('name', data.user.name);

        dispatch(loginSuccess({ token: data.token, userId: data.user._id }));
        handleSuccess(data.message);
        navigate('/');
      } else {
        handleError(data.message || 'Invalid email or password');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      handleError(error.message || 'An error occurred while logging in');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        backgroundColor: '#f5f5f5',
        fontFamily: 'serif',
      }}
    >
      <Card
        style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}
        bordered
      >
      
        <Title level={3}>Login to your account</Title>
        <Text type="secondary">
          Don’t have an account yet? <Link href="/signup">SignUp</Link>
        </Text>

        <Form
          layout="vertical"
          style={{ marginTop: 24 }}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                backgroundColor: '#4117d9',
                 borderColor: '#190859',
              }}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </Button>
          </Form.Item>
        </Form>

       
      </Card>
    </div>
  );
};

export default Login;
