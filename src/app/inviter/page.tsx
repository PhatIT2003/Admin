'use client'
import HeaderAdmin from "../layout/header";
import FooterAdmin from "../layout/Footer";
import { useState, useEffect, useRef } from 'react';
import { BASE_URL } from '@/Constants/infoApi';
import { IInvite } from '../types/backend';
import InviteTable from "../components/inviter/invite.table";
const InviterPage = (props: any) => { // Removed 'async' keyword
    const [invite, setInvite] = useState<IInvite[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const LIMIT = 10;
    const page = props?.searchParams?.page ?? 1;
    const total_items = useRef(0); // Changed to useRef
    const userId = props?.searchParams?.userId;
    
    
    useEffect(() => {
        if (userId) {
            localStorage.setItem('userId', userId);
        }
    }, [userId]);

   useEffect(() => {
    const fetchTaskData = async () => {
        const token = localStorage.getItem('token');


        if (!token) {
            setError('Bạn cần đăng nhập để xem thông tin này.');
            setLoading(false);
            return;
        }

        if (!userId) {
            setError('Không tìm thấy User ID');
            setLoading(false);
            return;
        }

        const apiUrl = `${BASE_URL}/admin/invite/${userId}?_page=${page}&_limit=${LIMIT}`;
     
        try {
            const res = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });



            total_items.current = +(res.headers?.get("x-total-Count") ?? 0);
            const data = await res.json();
        

            if (!res.ok) {
                throw new Error('Không thể lấy thông tin nhiệm vụ.');
            }

            setInvite(data.members);
           
        } catch (err) {
            console.error("Fetch Error:", err); // Log detailed error
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    fetchTaskData();
}, [page, userId]);
    return (
        <div>
            <HeaderAdmin />
            <div className="container-fluid p-4">
                {loading && <div className="loading-message">Đang tải dữ liệu...</div>}
                {error && <div className="error-message">{error}</div>}
                <InviteTable
                    userInvite={invite}
                    meta={{
                        current: +page,
                        pageSize: LIMIT,
                        total: total_items.current // Updated to useRef
                    }}
                />
            </div>
            <FooterAdmin />
        </div>
    );
}

export default InviterPage;