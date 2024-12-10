'use client';
import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/Constants/infoApi';
const LoginForm = () => {
    const router = useRouter();

    const onFinish = async (values: any) => {
        const { email, password } = values;
        try {
            const res = await fetch(`${BASE_URL}/admin/login`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!res.ok) {
                const errorMessage = await res.text();
                message.error(`Đăng nhập thất bại: ${errorMessage}`);
                return;
            }

            const data = await res.json();
  
            const token = data.data.token;
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('authenticated', 'true');
                
                // Gửi token ến API để thiết lập cookie
                const cookieRes = await fetch('/api/auth', {
                    method: 'POST',
                    body: JSON.stringify({ data: { token } }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (cookieRes.ok) {
                    const token = localStorage.getItem('token');
                    if (token) {
                        router.push('/users');
                    } else {
                        message.error('Bạn cần đăng nhập để truy cập trang này');
                    }
                } else {
                    message.error('Không thể thiết lập cookie');
                }
            } else {
                message.error('Không nhận được mã token');
            }
        } catch (err) {
            message.error('Đã xảy ra lỗi khi đăng nhập');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="login-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600, marginTop: "50px" }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
                <Input type="email" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Đăng nhập
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;
