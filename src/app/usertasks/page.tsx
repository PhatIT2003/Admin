'use client'
import HeaderAdmin from "../layout/header";
import FooterAdmin from "../layout/Footer";
import { useState, useEffect, useRef } from 'react';
import { BASE_URL } from '@/Constants/infoApi';
import { CollectionTask } from '../types/backend';
import UserTasksTable from "../components/userTask/userTasl.table";
const UserTasksPage = (props: any) => { // Removed 'async' keyword
    const [tasks, setTasks] = useState<CollectionTask[]>([]);
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

            try {
                const res = await fetch(`${BASE_URL}/admin/collectionTask/${userId}?_page=${page}&_limit=${LIMIT}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                total_items.current = +(res.headers?.get("x-total-Count") ?? 0); // Updated to useRef
                const data = await res.json();
                console.log(data);
                if (!res.ok) {
                    throw new Error('Không thể lấy thông tin nhiệm vụ.');
                }

                setTasks(data);
               
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskData();
    }, [page, userId]); // Added 'userId' to the dependency array

    return (
        <div>
            <HeaderAdmin />
            <div className="container-fluid p-4">
                {loading && <div className="loading-message">Đang tải dữ liệu...</div>}
                {error && <div className="error-message">{error}</div>}
                <UserTasksTable
                    userTasks={tasks}
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

export default UserTasksPage;