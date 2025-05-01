import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

function Footer() {
  return (
    <AntFooter style={{ backgroundColor: '#fff', textAlign: 'center', padding: '16px', boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)', marginTop: '40px' }}>
      <Text type="secondary" strong>
        All rights reserved by mariyam saleem &copy; 2025
      </Text>
    </AntFooter>
  );
}

export default Footer;
