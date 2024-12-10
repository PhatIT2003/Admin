
import React, { useEffect, useState } from 'react';
import { admin } from '@/app/types/backend';
import { BASE_URL } from '@/Constants/infoApi';

const Me = () => {
    const [user, setUser] = useState<admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage
          
            if (!token) {
                setError('Bạn cần đăng nhập để xem thông tin này.');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/admin/user`, { // Cập nhật endpoint
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Gửi token trong header
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error('Không thể lấy thông tin người dùng.');
                }

                const data = await res.json();
                setUser(Array.isArray(data) ? data : [data]);
                
            } catch (err) {
                setError((err as Error).message); // Type assertion to Error
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div>
              xin chào: {user.length > 0 ? user[0].name : 'Người dùng'} {/* Hiển thị tên người dùng */}
            </div>
        </div>
    );
};

export default Me;