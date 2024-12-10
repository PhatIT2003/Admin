'use client'
import TaskTable from "../components/task/task.table";
import HeaderAdmin from "../layout/header";
import FooterAdmin from "../layout/Footer";
import { useState, useEffect, useRef, Suspense } from 'react';
import { BASE_URL } from '@/Constants/infoApi';
import { Layout } from "antd";
import  Loading from "./loading"
import SiderAdmin from "../layout/sider";
const TaskPage = (props: any) => { // Removed 'async' keyword
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const LIMIT = 10;
    const page = props?.searchParams?.page ?? 1;
    const total_items = useRef(0); // Changed to useRef

    useEffect(() => {
        const fetchTaskData = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Bạn cần đăng nhập để xem thông tin này.');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${BASE_URL}/admin/tasks?_page=${page}&_limit=${LIMIT}`, {
                    method: 'GET',
                    next: { tags: ['list-users'] },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                total_items.current = +(res.headers?.get("x-total-Count") ?? 0); // Updated to useRef
                const data = await res.json();
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
    }, [page]); // Added 'page' to the dependency array

    return (
        <div>
                <Layout> 
            <HeaderAdmin />
            <SiderAdmin>
            <Suspense fallback={<><Loading /><Loading /></>}>
            <div className="container-fluid p-4">
                {loading && <div className="loading-message">Đang tải dữ liệu...</div>}
                {error && <div className="error-message">{error}</div>}
                <TaskTable
                    tasks={tasks}
                    meta={{
                        current: +page,
                        pageSize: LIMIT,
                        total: total_items.current // Updated to useRef
                    }}
                />
            </div>
            </Suspense>
            </SiderAdmin> 
            <FooterAdmin />
            </Layout>
        </div>
    );
}

export default TaskPage;