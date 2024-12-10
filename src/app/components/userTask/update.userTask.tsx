import { handleUpdateUserTaskAction } from '@/actions/userTasks';
import { CollectionTask } from '@/app/types/backend';
import {Modal, Input, Form, Row, Col, message, Radio} from 'antd';
import { useEffect, Dispatch, SetStateAction } from 'react';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: Dispatch<SetStateAction<boolean>>;
    dataUpdate: CollectionTask | null;
    setDataUpdate: Dispatch<SetStateAction<CollectionTask | null>>;
    onUpdateSuccess: (updatedTask: CollectionTask) => void;
}

const UpdateUserTask = (props: IProps) => {
    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate,
        onUpdateSuccess
    } = props;

    const [form] = Form.useForm();  

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                stt: dataUpdate.stt,
                name_task: dataUpdate.name_task,
                link_task: dataUpdate.link_task,
                token: dataUpdate.token,
                isCompleted: dataUpdate.isCompleted,
                completedAt: dataUpdate.completedAt ? new Date(dataUpdate.completedAt).toISOString().slice(0, 16) : '',
                completedBy: dataUpdate.completedBy
            })
        }
    }, [dataUpdate, form])

    const handleCloseUpdateModal = () => {
        form.resetFields()
        setIsUpdateModalOpen(false);
        setDataUpdate(null)
    }

    const onFinish = async (values: any) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
            message.error("User ID or Token not found. Please log in again.");
            return;
        }

        if (dataUpdate) {
            const data = {
                userId,
                taskId: dataUpdate.id, // Use taskId for the server action
                ...values
            }

            try {
                const updatedTask = await handleUpdateUserTaskAction(data, token);
                handleCloseUpdateModal();
                message.success("Update task succeeded");
                onUpdateSuccess(updatedTask);
            } catch (error) {
                console.error("Error updating task:", error);
                message.error("Failed to update task");
            }
        }
    };

    return (
        <Modal
            title="Update Task"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseUpdateModal()}
            maskClosable={false}
        >
            <Form
                name="updateTask"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="STT"
                            name="stt"
                            rules={[{ required: true, message: 'Please input STT!' }]}
                        >
                            <Input type='number' />
                        </Form.Item>
                    </Col>
                   
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Task Name"
                            name="name_task"
                            rules={[{ required: true, message: 'Please input task name!' }]}
                        >
                            <Input type='text' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Link Task"
                            name="link_task"
                            rules={[{ required: true, message: 'Please input link task!' }]}
                        >
                            <Input type='text' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Token"
                            name="token"
                            rules={[{ required: true, message: 'Please input token!' }]}
                        >
                            <Input type='number' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Completed"
                            name="isCompleted"
                        >
                            <Form.Item name="isCompleted" noStyle>
                                <Radio.Group>
                                    <Radio value={true}>True</Radio>
                                    <Radio value={false}>False</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Completed At"
                            name="completedAt"
                            rules={[{ required: true, message: 'Please input your completedAt!' }]}
                        >
                           <Input type='datetime-local' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Completed By"
                            name="completedBy"
                            rules={[{ required: true, message: 'Please input your completedBy!' }]}
                        >
                            <Input type='number' />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default UpdateUserTask;