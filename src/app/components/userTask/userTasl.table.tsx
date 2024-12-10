'use client'
import { Table, Popconfirm, Button, message, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PlusOutlined, DeleteTwoTone, EditTwoTone, LeftCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import CreateUserTask from './create.userTask';
import UpdateUserTask from './update.userTask';
import { handleDeleteUserTaskAction } from '@/actions/userTasks';
import { CollectionTask } from '@/app/types/backend';
import Link from 'next/link';


interface Iprops {
    userTasks: CollectionTask[] | [];
    meta: {
        current: number;
        pageSize: number;
        total: number;
    }
}

const UserTasksTable = (props: Iprops) => {
    const { userTasks, meta } = props;

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [localTasks, setLocalTasks] = useState<CollectionTask[]>(props.userTasks);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Update local state when props change
    useEffect(() => {
        setLocalTasks(props.userTasks);
    }, [props.userTasks]);

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
        if (userTasks) {
            setIsFetching(false);
        }
    }, [userTasks]);
    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId || !id) {
            message.error("User ID or Task ID is not available.");
            return; // Exit if userId or id is null
        }

        try {
            const res = await handleDeleteUserTaskAction({ userId, id }, token!); // Use non-null assertion for token
            if (res.message === 'Task deleted successfully') {
                message.success(res.message);
                // Update local state after successful deletion
                setLocalTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            } else {
                message.error(res.message);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
            message.error("An error occurred while deleting the task.");
        }
    };
     // Handler for creating new task
     const handleCreateTask = (newTask: CollectionTask) => {
        const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
        if (userId) {
            setLocalTasks(prevTasks => [{ ...newTask, userId }, ...prevTasks]);
        } else {
            message.error("User ID is not available.");
        }
    };

    // Handler for updating task
    const handleUpdateTask = (updatedTask: CollectionTask) => {
        setLocalTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === updatedTask.id ? updatedTask : task
            )
        );
    };  
    const filteredTasks = localTasks.filter(task =>
        task.name_task.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    const columns: ColumnsType<CollectionTask> = isMobile ? [
        {
            title: 'Task Info',
            render: (text, record) => (
                <div>
           
                    <p>Task ID: {record?.id}</p>
                    <p>STT: {record?.stt}</p>
                    <p>Name: {record?.name_task}</p>
                    <p>Link: {record?.link_task}</p>
                    <p>Token: {record?.token}</p>
                    <p>Completed: {record?.isCompleted ? 'true' : 'false'}</p>
                    <p>Completed At: {record?.completedAt}</p>
                    <p>Completed By: {record?.completedBy}</p>
                    <div className="row">
                        <div className="col-6 d-flex justify-content-center">
                            <EditTwoTone
                                twoToneColor="#f57800" style={{ cursor: "pointer", margin: "0 20px" }}
                                onClick={() => {
                                    setIsUpdateModalOpen(true);
                                    setDataUpdate(record);
                                }}
                            />
                        </div>
                        <div className="col-6 d-flex justify-content-center">
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
                        </div>
                    </div>
                </div>
            ),
        },
    ] : [
        {
            title: 'Task ID',
            dataIndex: 'id',
            ellipsis: true,
        },
        {
            title: 'STT',
            dataIndex: 'stt',
            ellipsis: true,
        },
        {
            title: 'Task Name',
            dataIndex: 'name_task',
            ellipsis: true,
        },
        {
            title: 'Link',
            dataIndex: 'link_task',
            ellipsis: true,
        },
        {
            title: 'Token',
            dataIndex: 'token',
            ellipsis: true,
        },
        {
            title: 'Completed',
            render: (text, record) => record.isCompleted ? 'true' : 'false',
            ellipsis: true,
        },
        {
            title: 'Completed At',
            dataIndex: 'completedAt',
            ellipsis: true,
        },
        {
            title: 'Completed By',
            dataIndex: 'completedBy',
            ellipsis: true,
        },
        {
            title: 'Actions',
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                    <EditTwoTone
                        twoToneColor="#f57800" style={{ cursor: "pointer", margin: "0 20px" }}
                        onClick={() => {
                            setIsUpdateModalOpen(true);
                            setDataUpdate(record);
                        }}
                    />
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
                </>
                )
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

    const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
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
                dataSource={filteredTasks}
                columns={columns}
                onChange={onChange}
                pagination={{
                    ...meta,
                    showTotal: (total, range) => {
                        return (<div> {range[0]}-{range[1]} trên {total} tasks</div>)
                    }
                }}
            />
             <CreateUserTask
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                onCreateSuccess={handleCreateTask}
            />

            <UpdateUserTask
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                onUpdateSuccess={handleUpdateTask}
            />
        </div>
    )
}

export default UserTasksTable;