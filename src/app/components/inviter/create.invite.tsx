import { handleCreateInviteAction } from '@/actions/invite';
import { IInvite } from '@/app/types/backend';
import { Modal, Input, Form, Row, Col, message } from 'antd';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>;
    onCreateSuccess: (newTask: IInvite) => void;
}

const CreateInvite = (props: IProps) => {
    const { isCreateModalOpen, setIsCreateModalOpen, onCreateSuccess } = props;
    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };

    const onFinish = async (values: any) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token') || '';

        if (!userId || !token) {
            message.error("Missing authentication information.");
            return;
        }

        try {
            const res = await handleCreateInviteAction(
                values.id,
                userId,
                token
            );

            if (res.success) {
                handleCloseCreateModal();
                message.success("Invite created successfully!");
                onCreateSuccess(res);
            } else {
                message.error(res.error || "Failed to create invite!");
            }
        } catch (error: any) {
            console.error("Error details:", error);
            message.error(error.message || "An error occurred while creating the invite.");
        }
    };

    return (
        <Modal
            title="Create New Invite"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCloseCreateModal}
            maskClosable={false}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Row gutter={[15, 15]}>
                    <Col span={24}>
                        <Form.Item
                            label="Invite ID"
                            name="id"
                            rules={[
                                { required: true, message: 'Please input your ID!' },
                            ]}
                        >
                            <Input type="text" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CreateInvite;
