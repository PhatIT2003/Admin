import { handleUpdateUserAction } from '@/actions/user';
import { UserInfo } from '@/app/types/backend';
import {Modal, Input,Form, Row, Col, message, Select} from 'antd';
import { useEffect } from 'react';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (open: boolean) => void;
    dataUpdate: UserInfo | null;
    setDataUpdate: (data: UserInfo | null) => void;
    onUpdateSuccess: (updatedUser: UserInfo) => void;
}

const UpdateUser = (props: IProps) => {

    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate,
        onUpdateSuccess
    } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            //code
            form.setFieldsValue({
                user_id: dataUpdate.user_id,
                first_name: dataUpdate.first_name,
                last_name: dataUpdate.last_name,
                username: dataUpdate.username,
                auth_date: dataUpdate.auth_date,
                hash: dataUpdate.hash,
                query_id: dataUpdate.query_id,
                languageCode: dataUpdate.languageCode,
                photoUrl: dataUpdate.photoUrl,
                allowsWriteToPm: dataUpdate.allowsWriteToPm,
                token: dataUpdate.token,
                inviter: dataUpdate.inviter,
                address: dataUpdate.address,
                createdAt: dataUpdate.createdAt ? new Date(dataUpdate.createdAt).toISOString().slice(0, 16) : '',
                lastAuthenticated: dataUpdate.lastAuthenticated ? new Date(dataUpdate.lastAuthenticated).toISOString().slice(0, 16) : '',
                lastClaim: dataUpdate.lastClaim ? new Date(dataUpdate.lastClaim).toISOString().slice(0, 16) : '',
            })
        }
    }, [dataUpdate, form])

    const handleCloseUpdateModal = () => {
        form.resetFields()
        setIsUpdateModalOpen(false);
        setDataUpdate(null)
    }

    const onFinish = async (values: any) => {
        const { user_id, first_name, last_name, auth_date, hash, query_id, token, inviter, address, username, languageCode, photoUrl, allowsWriteToPm, createdAt, lastAuthenticated, lastClaim } = values;
        if (dataUpdate) {
            const data = {
                id: dataUpdate.id,
                user_id, first_name, last_name, username, auth_date, hash, query_id, languageCode, photoUrl, allowsWriteToPm, token, inviter, address, createdAt, lastAuthenticated, lastClaim
            }

            const Token = localStorage.getItem('token');
            if (Token) {
                await handleUpdateUserAction(data, Token);
                handleCloseUpdateModal();
                message.success("Update user succeed")
                if (onUpdateSuccess) {
                    onUpdateSuccess({
                        id: dataUpdate.id,
                        user_id, first_name, last_name, username, auth_date, hash, query_id, languageCode, photoUrl, allowsWriteToPm, token, inviter, address, createdAt, lastAuthenticated, lastClaim
                    });
                }
            } else {
                message.error("Token not found")
            }
        }
    };

    return (
        <Modal
            title="Update a user"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseUpdateModal()}
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
                            <Input type='datetime-local' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="lastAuthenticated"
                            name="lastAuthenticated"
                            rules={[{ required: true, message: 'Please input your lastAuthenticated!' }]}
                        >
                            <Input type='datetime-local' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="lastClaim"
                            name="lastClaim"
                            rules={[{ required: true, message: 'Please input your lastClaim!' }]}
                        >
                            <Input type='datetime-local' />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default UpdateUser;
