import React, { useState } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
  
      // Save full user info (uid, email, name)
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        name: values.name, // ✅ Add this line!
      });
  
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
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
