'use client'
import { Table, Popconfirm, Button, message, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PlusOutlined, DeleteTwoTone,LeftCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import CreateInvite from './create.invite';
import { handleDeleteInviteAction } from '@/actions/invite';
import { IInvite } from '@/app/types/backend';
import Link from 'next/link';



interface Iprops {
    userInvite: IInvite[] | [];
    meta: {
        current: number;
        pageSize: number;
        total: number;
    }
}

const InviteTable = (props: Iprops) => {
    const { userInvite, meta } = props;

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [localInvite, setLocalInvite] = useState<IInvite[]>(props.userInvite);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Update local state when props change
    useEffect(() => {
        setLocalInvite(props.userInvite);
    }, [props.userInvite]);
    

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize(); // Check on mount
        window.addEventListener('resize', handleResize); // Update on resize

        return () => {
            window.removeEventListener('resize', handleResize); // Cleanup
        };
    }, []);

    useEffect(() => {
        if (userInvite) {
            setIsFetching(false);
        }
    }, [userInvite]);
    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('token') || '';
        const userId = localStorage.getItem('userId') || '';
        try {
            const res = await handleDeleteInviteAction(id, userId, token);
            if (res.success) {
                // Cập nhật danh sách sau khi xóa
                setLocalInvite(prevInvite => prevInvite.filter(invite => invite.id !== id));
                message.success("Xóa thành công!");
            } else {
                message.error(res.message || "Xóa thất bại");
            }
        } catch (error) {
            console.error("Error deleting invite:", error);
            message.error("Xóa thất bại");
        }
    };
    
    
     // Handler for creating new task
     const handleCreateInvite = (newInvite: IInvite) => {
        // Kiểm tra ID đã tồn tại hay chưa
        const isDuplicate = localInvite.some(invite => invite.id === newInvite.id);
        if (isDuplicate) {
            message.error("ID này đã tồn tại, vui lòng thử ID khác.");
            return;
        }
    
        // Cập nhật danh sách sau khi thêm mới
        setLocalInvite(prevInvite => [...prevInvite]); // Cập nhật đầy đủ dữ liệu

        message.success("Thêm mới thành công!");
        
        // Reload the page to reflect changes
        window.location.reload();
    };
   
    const filteredInvite = localInvite.filter(inviter => 
        (inviter?.first_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
        (inviter?.last_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())||
        (inviter?.user_id?.toString() || "").includes(searchTerm.toLowerCase())
    );
    
    
    const columns: ColumnsType<IInvite> = isMobile ? [
        {
            title: 'Invite Info',
            render: (text, record) => (
                <div>
                    <p>ID: {record?.id}</p>
                    <p>User ID: {record?.user_id}</p>
                    <p>Name: {record?.first_name} {record?.last_name}</p>
                    <p>Token: {record?.token}</p>
                    <p>Inviter: {record?.inviter}</p>
                    <p>Photo: {record?.photoUrl}</p>
                    <div className="col-6 d-flex justify-content-center">
                        <Popconfirm
                            placement="leftTop"
                            title={`Xác nhận xóa task ${record.first_name} ${record.last_name}?`}
                            description={"Bạn có chắc chắn muốn xóa task này?"}
                            onConfirm={() => handleDelete(record.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
                    </div>
                </div>
            ),
        },
    ] : [
        {
            title: 'ID',
            dataIndex: 'id',
            ellipsis: true,
        },
        {
            title: 'User ID',
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
            title: 'Token',
            dataIndex: 'token',
            ellipsis: true,
        },
        {
            title: 'Inviter',
            dataIndex: 'inviter',
            ellipsis: true,
        },
        {
            title: 'Photo',
            dataIndex: 'photoUrl',
            ellipsis: true,
        },
        {
            title: 'Actions',
            align: "center",
            render: (text, record) => {
                return (
                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa task"}
                        description={"Bạn có chắc chắn muốn xóa task này?"}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer" }}>
                            <DeleteTwoTone twoToneColor="#ff4d4f" />
                        </span>
                    </Popconfirm>
                );
            }
        }
    ];

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
           
            <Link href="/users"className="fs-3">
             <LeftCircleOutlined />
             </Link>
                <Input 
                    placeholder="Tìm kiếm theo tên task" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
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

    const onChange = (pagination: any) => {
        if (pagination && pagination.current) {
            const params = new URLSearchParams(searchParams);
            params.set('page', pagination.current);
            replace(`${pathname}?${params.toString()}`);
            setIsFetching(false);
        }
    };


    return (
        <div>
            <Table
                title={renderHeader}
                loading={isFetching}
                rowKey={"id"}
                bordered
                dataSource={filteredInvite}
                columns={columns}
                onChange={onChange}
                pagination={{
                    ...meta,
                    showTotal: (total, range) => {
                        return (<div> {range[0]}-{range[1]} trên {total} invites</div>)
                    }
                }}
            />
             < CreateInvite 
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                onCreateSuccess={handleCreateInvite}
            />

         
        </div>
    )
}

export default InviteTable;