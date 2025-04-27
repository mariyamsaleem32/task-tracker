import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate('/');
    } catch (error) {
      alert(error.message); // Show proper error to user
    }
    setLoading(false);
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
