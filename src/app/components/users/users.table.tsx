'use client'
import { Table, Popconfirm, Button, message, Drawer, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PlusOutlined, DeleteTwoTone, EditTwoTone, EyeOutlined } from '@ant-design/icons';
import CreateUser from './create.user';
import UpdateUser from './update.user';
import { UserInfo } from '../../types/backend';
import { handleDeleteUserAction } from '@/actions/user';
import Image from 'next/image';
import Link from 'next/link';

    
interface IProps {
    users: UserInfo[] | [];
    meta: {
        current: number;
        pageSize: number;
        total: number;
    }
}

const UsersTable = (props: IProps) => {
    const { meta } = props;
    
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    
    // Manage users state locally
    const [localUsers, setLocalUsers] = useState<UserInfo[]>(props.users);

    // Update local state when props change
    useEffect(() => {
        setLocalUsers(props.users);
    }, [props.users]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    
    // New states for Drawer
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleDeleteUser = async (id: string) => {
        const token = localStorage.getItem('token') || '';
        try {
            const res = await handleDeleteUserAction(id, token);
            if (res) {
                message.success(res.message || "Đã xóa người dùng thành công");
                // Update local state after successful deletion
                setLocalUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            } else {
                message.error(res.message || "Lỗi khi xóa người dùng");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            message.error("Đã xảy ra lỗi khi xóa người dùng.");
        }
    };

    // Handler for creating new user
    const handleCreateUser = (newUser: UserInfo) => {
        setLocalUsers(prevUsers => [newUser, ...prevUsers]);
    };

    // Handler for updating user
    const handleUpdateUser = (updatedUser: UserInfo) => {
        setLocalUsers(prevUsers => 
            prevUsers.map(user => 
                user.id === updatedUser.id ? updatedUser : user
            )
        );
    };

    const filteredUsers = localUsers.filter(user => 
        user.first_name.toLowerCase().includes(searchText.toLowerCase()) || 
        user.last_name.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: ColumnsType<UserInfo> = isMobile ? [
        {
            title: 'User Info',
            render: (text, record) => (
                <div>
                    <p>ID: {record.id}</p>
                    <p>User ID: {record.user_id}</p>
                    <p>Name: {record.first_name} {record.last_name}</p>
                    <div className="row">
                        <div className="col-4 d-flex justify-content-center">
                            <EyeOutlined 
                                style={{ cursor: "pointer", margin: "0 10px" }}
                                onClick={() => {
                                    setSelectedUser(record);
                                    setIsDrawerVisible(true);
                                }}
                            />
                        </div>
                        <div className="col-4 d-flex justify-content-center">
                            <EditTwoTone
                                twoToneColor="#f57800"
                                style={{ cursor: "pointer", margin: "0 10px" }}
                                onClick={() => {
                                    setIsUpdateModalOpen(true);
                                    setDataUpdate(record);
                                }}
                            />
                        </div>
                        <div className="col-4 d-flex justify-content-center">
                            <Popconfirm
                                placement="leftTop"
                                title={"Xác nhận xóa user"}
                                description={"Bạn có chắc chắn muốn xóa user này ?"}
                                onConfirm={() => handleDeleteUser(record.id)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </Popconfirm>
                        </div>
                    </div>
                <div className="d-flex justify-content-center mt-4">
                <Button block>
                    <Link href={`/usertasks?userId=${record.user_id}`}>Tasks</Link>
                </Button>
                <Button block>
                    <Link href={`/inviter?userId=${record.user_id}`}>Invite</Link>
                </Button>
                </div>
                </div>  
            ),
        },
    ] : [
        {
            title: 'id',
            dataIndex: 'id',
            ellipsis: true,
        },
        {
            title: 'user_id',
            dataIndex: 'user_id',
            ellipsis: true,
        },
        {
            title: 'first_name',
            dataIndex: 'first_name',
            ellipsis: true,
        },
        {
            title: 'last_name',
            dataIndex: 'last_name',
            ellipsis: true,
        },
        {
            title: 'Actions',
            align: "center",
            render: (text, record) => (
                <>
                    <EyeOutlined 
                        style={{ cursor: "pointer", margin: "0 10px" }}
                        onClick={() => {
                            setSelectedUser(record);
                            setIsDrawerVisible(true);
                        }}
                    />
             
                    <EditTwoTone
                        twoToneColor="#f57800"
                        style={{ cursor: "pointer", margin: "0 20px" }}
                        onClick={() => {
                            setIsUpdateModalOpen(true);
                            setDataUpdate(record);
                        }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa user"}
                        description={"Bạn có chắc chắn muốn xóa user này ?"}
                        onConfirm={() => handleDeleteUser(record.id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer" }}>
                            <DeleteTwoTone twoToneColor="#ff4d4f" />
                        </span> 
                    </Popconfirm>
                
                </>
            )
        },
        {
            title: 'Menu',
            align: "center",
            render: (text, record) => (
                <div>
                <div>
                <Link href={`/usertasks?userId=${record.user_id}`}>
                <Button block>
              Tasks
            </Button>
            </Link>
            </div>
            <div>
                <Link href={`/inviter?userId=${record.user_id}`}>
                <Button block>
              Invite
            </Button>
            </Link>
            </div>
            </div>
            )
        }
        
    ];

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Input 
                    placeholder="Tìm kiếm theo tên" 
                    value={searchText} 
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }} 
                      
                />
          
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Thêm mới
                </Button>
                
            </div>
        )
    }

    const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
        if (pagination && pagination.current) {
            const params = new URLSearchParams(searchParams);
            params.set('page', pagination.current);
            replace(`${pathname}?${params.toString()}`);
            setIsFetching(false)
        }
    };

    return (
        <>
            <Table
                title={renderHeader}
                loading={isFetching}
                rowKey={"id"}
                bordered
                dataSource={filteredUsers}
                columns={columns}
                onChange={onChange}
                pagination={{
                    ...meta,
                    showTotal: (total, range) => {
                        return (<div> {range[0]}-{range[1]} trên {total} rows</div>)
                    }
                }}
            />
            
            {/* Drawer for user details */}
            <Drawer
                title="Chi tiết người dùng"
                placement="right"
                onClose={() => setIsDrawerVisible(false)}
                open={isDrawerVisible}
                width={500}
            >
                {selectedUser && (
                    <div>
                        <p><strong>ID:</strong> {selectedUser.id}</p>
                        <p><strong>User ID:</strong> {selectedUser.user_id}</p>
                        <p><strong>First name:</strong> {selectedUser.first_name}</p>
                        <p><strong>Last name:</strong> {selectedUser.last_name}</p>
                        <p><strong>Username:</strong> {selectedUser.username}</p>
                        <p><strong>Auth date:</strong> {selectedUser.auth_date}</p>
                        <p><strong>Hash:</strong> {selectedUser.hash}</p>
                        <p><strong>Query id:</strong> {selectedUser.query_id as string}</p>
                        <p><strong>Language code:</strong> {selectedUser.languageCode}</p>
                        <p><strong>Photo url:</strong> <Image src={selectedUser.photoUrl} alt="avatar" width={50} height={50} /></p>
                        <p><strong>Allows write to pm:</strong> {selectedUser.allowsWriteToPm ? "Yes" : "No"}</p>
                        <p><strong>Token:</strong> {selectedUser.token}</p>
                        <p><strong>Inviter:</strong> {selectedUser.inviter}</p>
                        <p><strong>Address:</strong> {selectedUser.address}</p>
                        <p><strong>Created at:</strong> {selectedUser.createdAt}</p>
                        <p><strong>Last authenticated:</strong> {selectedUser.lastAuthenticated}</p>
                        <p><strong>Last claim:</strong> {selectedUser.lastClaim}</p>
                    </div>
                )}
            </Drawer>

            <CreateUser
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                onCreateSuccess={handleCreateUser}
            />
            <UpdateUser
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                onUpdateSuccess={handleUpdateUser}
            />
          
        </>
    )
}

export default UsersTable;