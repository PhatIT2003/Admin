"use client"
import React from 'react';

import { Layout } from 'antd';

const {  Footer} = Layout;

const FooterAdmin = () => {
    return (
    <div>
   <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
    </div>
    )
}

export default FooterAdmin;

