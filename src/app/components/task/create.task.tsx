import {handleCreateTaskAction } from '@/actions/task';
import { ITask } from '@/app/types/backend';
import {
    Modal, Input, Form, Row, Col, message
} from 'antd';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>;
    onCreateSuccess: (newTask: ITask) => void;
}

const CreateTask = (props: IProps) => {

    const {
        isCreateModalOpen, setIsCreateModalOpen, onCreateSuccess
    } = props;

    const [form] = Form.useForm();
    
    const handleCloseCreateModal = () => {
        form.resetFields()
        setIsCreateModalOpen(false);

    }

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        const token = localStorage.getItem('token') || '';
        const userId = localStorage.getItem('userId');

        const taskData = { ...values, userId };

        try {
            const res = await handleCreateTaskAction(taskData, token);

            if (res) {
                handleCloseCreateModal();
                message.success("Create succeed!");
                onCreateSuccess(res);
            } else {
                message.error("Create failed!");
            }
        } catch (error) {
            console.error("Error creating task:", error);
            message.error("An error occurred while creating the task.");
        }
    };

    return (
        <Modal
            title="Add new task"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseCreateModal()}
            maskClosable={false}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="STT"
                            name="stt"
                            rules={[{ required: true, message: 'Please input your STT!' }]}
                        >
                            <Input type='number' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Task Name"
                            name="name_task"
                            rules={[{ required: true, message: 'Please input your task name!' }]}
                        >
                            <Input type='text' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Link Task"
                            name="link_task"
                            rules={[{ required: true, message: 'Please input your link task!' }]}
                        >
                            <Input type='text' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Token"
                            name="token"
                            rules={[{ required: true, message: 'Please input your token!' }]}
                        >
                            <Input type='number' />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default CreateTask;
