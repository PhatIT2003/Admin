'use client'
import { Table, Popconfirm, Button, message, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PlusOutlined, DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import CreateTask from './create.task';
import UpdateTask from './update.task';
import { ITask } from '../../types/backend';
import { handleDeleteTaskAction } from '@/actions/task';


interface Iprops {
    tasks: ITask[] | [];
    meta: {
        current: number;
        pageSize: number;
        total: number;
    }
}

const TasksTable = (props: Iprops) => {
    const { tasks, meta } = props;

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [localTasks, setLocalTasks] = useState<ITask[]>(props.tasks);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Update local state when props change
    useEffect(() => {
        setLocalTasks(props.tasks);
    }, [props.tasks]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize(); // Check on mountl
        window.addEventListener('resize', handleResize); // Update on resize

        return () => {
            window.removeEventListener('resize', handleResize); // Cleanup
        };
    }, []);

    useEffect(() => {
        if (tasks) {
            setIsFetching(false);
        }
    }, [tasks]);

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('token') || '';
        try {
            const res = await handleDeleteTaskAction(id, token);
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
     const handleCreateTask = (newTask: ITask) => {
        setLocalTasks(prevTasks => [newTask, ...prevTasks]);
    };

    // Handler for updating task
    const handleUpdateTask = (updatedTask: ITask) => {
        setLocalTasks(prevTasks => 
            prevTasks.map(task => 
                task.id === updatedTask.id ? updatedTask : task
            )
        );
    };

    const filteredTasks = localTasks.filter(task => 
        task.name_task.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns: ColumnsType<ITask> = isMobile ? [
        {
            title: 'Task Info',
            render: (text, record) => (
                <div>
                    <p>ID: {record.id}</p>
                    <p>STT: {record.stt}</p>
                    <p>Name: {record.name_task}</p>
                    <p>Link: {record.link_task}</p>
                    <p>Token: {record.token}</p>
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
            title: 'ID',
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
            <CreateTask
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                onCreateSuccess={handleCreateTask}
            />

            <UpdateTask
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                onUpdateSuccess={handleUpdateTask}
            />
        </div>
    )
}

export default TasksTable;