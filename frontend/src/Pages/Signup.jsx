import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, Space, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import * as Yup from 'yup';
import { Formik, Field, ErrorMessage } from 'formik';
import { handleError, handleSuccess } from '../utils/utils.jsx';

const { Title, Text, Link } = Typography;
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_API_BASEURL;

// Validation Schema (Same as Backend Joi)
const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, 'Name can only contain letters and numbers (No spaces or special characters)')
    .min(3, 'Name must be at least 3 characters long')
    .max(20, 'Name cannot exceed 20 characters')
    .required('Name is required'),

  email: Yup.string()
    .email('Enter a valid email address (e.g., example@domain.com)')
    .matches(/^[^\s@]+@[^\s@]+\.(com|net)$/, 'Only .com and .net domains are allowed')
    .required('Email is required'),

  password: Yup.string()
    .min(3, 'Password must be at least 3 characters long')
    .max(30, 'Password must not exceed 30 characters')
    .matches(/^[^\s]*$/, 'Only letters (A-Z, a-z) and numbers (0-9) are allowed. No spaces.')
    .matches(/^[a-zA-Z0-9]*$/, 'Only letters (A-Z, a-z) and numbers (0-9) are allowed.')
    .required('Password is required'),
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        handleSuccess(data.message);
        navigate('/');  // Redirect to home page or dashboard
      } else {
        handleError(data.message || 'An error occurred while signing up');
      }
    } catch (error) {
      setLoading(false);
      handleError(error.message || 'An error occurred while signing up');
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
        <Title level={3}>Create a New Account</Title>
        <Text type="secondary">
          Already have an account? <Link href="/login">Login</Link>
        </Text>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur }) => (
            <Form
              layout="vertical"
              style={{ marginTop: 24 }}
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                label="Your Name"
                validateStatus="error"
                help={<ErrorMessage name="name" component="div" />}
              >
                <Field
                  name="name"
                  type="text"
                  as={Input}
                  placeholder="Enter your name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item
                label="Email Address"
                validateStatus="error"
                help={<ErrorMessage name="email" component="div" />}
              >
                <Field
                  name="email"
                  type="email"
                  as={Input}
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                validateStatus="error"
                help={<ErrorMessage name="password" component="div" />}
              >
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    as={Input.Password}
                    placeholder="Enter your password"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 focus:outline-none cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {/* {showPassword ? <EyeInvisibleOutlined /> : <EyeTwoTone />} */}
                  </button>
                </div>
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
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </Button>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Signup;
