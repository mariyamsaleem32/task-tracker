import React, { useState } from 'react';
import { Form, Input, Button, Card, notification } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../utils/axios';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true); // Set loading to true before API call

    try {
      const response = await API.post('/register', values);
      notification.success({
        message: 'Registration Successful',
        description: 'You can now log in to your account.',
      });
      navigate('/login');  // Redirect to login page
    } catch (error) {
      notification.error({
        message: 'Registration Failed',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);  // Reset loading state after the API call is done
    }
  };

  return (
    <Card title="Register" style={{ width: 300, margin: 'auto', marginTop: 100 }}>
      <Form onFinish={onFinish}>
        <Form.Item name="name" rules={[{ required: true, message: 'Please input your Name!' }]}>
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to="/login">Already have an account? Login</Link>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Register;
