import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router';

const Notfound = () => {
    return(
    <div style={{
      height:'100vh',
    }}>
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary"><Link to={'/'} style={{textDecoration:'none'}}>Back Home</Link></Button>}
  />
  </div>
    );
};
export default Notfound;