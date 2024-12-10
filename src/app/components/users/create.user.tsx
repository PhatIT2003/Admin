import { handleCreateUserAction } from '@/actions/user';
import { UserInfo } from '@/app/types/backend';
import {
    Modal, Input, Form, Row, Col, message, Select
} from 'antd';
import { Dispatch, SetStateAction } from 'react';

interface ICreateUserProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>;
    onCreateSuccess: (newUser: UserInfo) => void;
}

const CreateUser = (props: ICreateUserProps) => {

    const {
        isCreateModalOpen, setIsCreateModalOpen, onCreateSuccess
    } = props;

    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields()
        setIsCreateModalOpen(false);

    }

    const onFinish = async (values: any) => {
      
        const token = localStorage.getItem('token') || '';
        try {
            const res = await handleCreateUserAction(values, token);
        

            if (res) {
                handleCloseCreateModal();
                message.success("Create succeed!");
                onCreateSuccess(res);
            } else {
                message.error("Create failed!");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            message.error("An error occurred while creating the user.");
        }
    };

    
    return (
        <Modal
            title="Add new user"
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
                            label="user_id"
                            name="user_id"
                            rules={[{ required: true, message: 'Please input your user_id!' }]}
                        >
                        <Input type='number' />
                        </Form.Item>
                    </Col>
                   
                    <Col span={24} md={12}>
                        <Form.Item
                            label="first_name"
                            name="first_name"
                            rules={[{ required: true, message: 'Please input your first_name!' }]}
                        >
                            <Input type='text' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="last_name"
                            name="last_name"
                            rules={[{ required: true, message: 'Please input your last_name!' }]}
                        >
                            <Input type='text' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your last_name!' }]}
                        >
                            <Input type='text' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="auth_date"
                            name="auth_date"
                            rules={[{ required: true, message: 'Please input your auth_date!' }]}
                        >
                            <Input type='number' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="hash"
                            name="hash"
                            rules={[{ required: true, message: 'Please input your hash!' }]}
                        >
                            <Input type='text' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="query_id"
                            name="query_id"
                            rules={[{ required: true, message: 'Please input your query_id!' }]}
                        >
                            <Input type='text' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="languageCode"
                            name="languageCode"
                            rules={[{ required: true, message: 'Please input your hash!' }]}
                        >
                            <Select placeholder="Select vn or en">
                                <Select.Option value={true}>vn</Select.Option>
                                <Select.Option value={false}>en</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="photoUrl"
                            name="photoUrl"
                            rules={[{ required: true, message: 'Please input your hash!' }]}
                        >
                            <Input type='text' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="allowsWriteToPm"
                            name="allowsWriteToPm"
                            rules={[{ required: true, message: 'Please select allowsWriteToPm!' }]}
                        >
                            <Select placeholder="Select true or false">
                                <Select.Option value={true}>True</Select.Option>
                                <Select.Option value={false}>False</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="token"
                            name="token"
                            rules={[{ required: true, message: 'Please input your token!' }]}
                        >
                            <Input type='number' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="inviter"
                            name="inviter"
                            rules={[{ required: true, message: 'Please input your inviter!' }]}
                        >
                            <Input type='number' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="address"
                            name="address"
                            rules={[{ required: true, message: 'Please input your address!' }]}
                        >
                            <Input type='text' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="createdAt"
                            name="createdAt"
                            rules={[{ required: true, message: 'Please input your createdAt!' }]}
                        >
                            <Input type='datetime-local' defaultValue={new Date("2024-12-03T03:25:39.957Z").toISOString().slice(0, 16)} />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="lastAuthenticated"
                            name="lastAuthenticated"
                            rules={[{ required: true, message: 'Please input your lastAuthenticated!' }]}
                        >
                            <Input type='datetime-local' defaultValue={new Date("2024-12-03T04:00:03.175Z").toISOString().slice(0, 16)} />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="lastClaim"
                            name="lastClaim"
                            rules={[{ required: true, message: 'Please input your address!' }]}
                        >
                            <Input type='date' />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default CreateUser;
