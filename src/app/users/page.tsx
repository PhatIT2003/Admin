'use client'
import UsersTable from "../components/users/users.table";
import React, { Suspense, useEffect, useState } from 'react';
import FooterAdmin from "../layout/Footer";
import HeaderAdmin from "../layout/header";
import { UserInfo } from "../types/backend";
import { BASE_URL } from "@/Constants/infoApi";
import { Layout } from "antd";
import SiderAdmin from "../layout/sider";
import Loading from "./loading";

const UserPage = (props: any) => {
   
    const [user, setUser] = useState<UserInfo[]>([]);

    const [error, setError] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const LIMIT = 10; // Move LIMIT declaration here
    const page = props?.searchParams?.page ?? 1; // Define page here
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage
          
            if (!token) {
                setError('Bạn cần đăng nhập để xem thông tin này.');
              
                return;
            }
        
            try {
                const res = await fetch(`${BASE_URL}/admin/members`, { // Cập nhật endpoint
                    method: 'GET',
                    next: { tags: ['list-users'] },
                    headers: {
                        'Authorization': `Bearer ${token}`, // Gửi token trong header
                        'Content-Type': 'application/json',
                    },
                });
                const total_items = +(res.headers?.get("x-total-Count") ?? 0);
                setTotalItems(total_items);
                const userData = await res.json();
         
                if (!res.ok) {
                    throw new Error('Không thể lấy thông tin người dùng.');
                }

                setUser(userData); // Update to set array of users
     
            } catch (err) {
                setError((err as Error).message); // Type assertion to Error
            } 
        };

        fetchUserData();
    }, []);
    return (
        <div>
           <Layout> 
            <HeaderAdmin />
            <SiderAdmin>
            <Suspense fallback={<><Loading /><Loading /></>}>
            <div className="container-fluid p-4">
                {error && <div className="error-message">{error}</div>}
                
                <UsersTable
                    users={user}
                    meta={{
                        current: +page,
                        pageSize: LIMIT,
                        total: totalItems
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

export default UserPage;