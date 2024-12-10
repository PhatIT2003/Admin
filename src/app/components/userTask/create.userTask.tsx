import {handleCreateUserTaskAction } from '@/actions/userTasks';
import { CollectionTask } from '@/app/types/backend';
import {
    Modal, Input, Form, Row, Col, message, Radio
} from 'antd';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>;
    onCreateSuccess: (newTask: CollectionTask) => void;
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
// In CreateTask component
const onFinish = async (values: any) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token') || '';

    if (!userId) {
        message.error("User ID is not available. Please log in again.");
        return;
    }

    try {
        const res = await handleCreateUserTaskAction({
            ...values,
            userId // Explicitly add userId to the payload
        }, token);

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
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Completed"
                            name="isCompleted"
                            rules={[{ required: true, message: 'Please input your completed!' }]}
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
                           <Input type='datetime-local' defaultValue={new Date("2024-12-03T03:25:39.957Z").toISOString().slice(0, 16)} />
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

export default CreateTask;
