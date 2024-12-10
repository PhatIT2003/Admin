'use client'
import { BASE_URL } from '@/Constants/infoApi';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

const WithAuth = () => {
    const router = useRouter(); // Move useRouter here

    const handleLogout = async () => {
        try {
            const response = await fetch(`${BASE_URL}/admin/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Gửi token nếu cần
                }
            });

            if (response.ok) {
                // Xóa token khỏi localStorage
                localStorage.removeItem('token');
                // Chuyển hướng đến trang đăng nhập hoặc trang khác
                router.push('/login');  
            } else {    
                const errorData = await response.json();
                console.error('Logout failed:', errorData.message);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return <div>
        <Button onClick={handleLogout}>Logout</Button>
    </div>;
};

export default WithAuth;

