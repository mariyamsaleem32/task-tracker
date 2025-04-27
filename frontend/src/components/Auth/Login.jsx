import React, { useState } from 'react';
import { Form, Input, Button, Card, notification } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../utils/axios';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);  // Set loading to true before API call

    try {
      const { data } = await API.post('/login', values);
      localStorage.setItem('token', data.token);
      notification.success({
        message: 'Login Successful',
        description: 'You are now logged in.',
      });
      navigate('/taskboard');  // Redirect to task board page
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.response?.data?.message || 'Invalid credentials. Please try again.',
      });
      setLoading(false);  // Reset loading state after error
    }
  };

  return (
    <Card title="Login" style={{ width: 300, margin: 'auto', marginTop: 100 }}>
      <Form onFinish={onFinish}>
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to="/register">Don't have an account? Register</Link>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;
