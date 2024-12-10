import { handleUpdateTaskAction } from '@/actions/task';
import { ITask } from '@/app/types/backend';
import {Modal, Input,Form, Row, Col, message} from 'antd';
import { useEffect, Dispatch, SetStateAction } from 'react';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: Dispatch<SetStateAction<boolean>>;
    dataUpdate: ITask | null;
    setDataUpdate: Dispatch<SetStateAction<ITask | null>>;
    onUpdateSuccess: (updatedTask: ITask) => void;
}

const UpdateTask = (props: IProps) => {

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
                stt: dataUpdate.stt,
                name_task: dataUpdate.name_task,
                link_task: dataUpdate.link_task,
                token: dataUpdate.token
            })
        }
    }, [dataUpdate, form])

    const handleCloseUpdateModal = () => {
        form.resetFields()
        setIsUpdateModalOpen(false);
        setDataUpdate(null)
    }

    const onFinish = async (values: any) => {
        const { stt, name_task, link_task, token } = values;
        if (dataUpdate) {
            const data = {
                id: dataUpdate.id,
                stt,
                name_task,
                link_task,
                token
            }

            const Token = localStorage.getItem('token');
            if (Token) {
                await handleUpdateTaskAction(data, Token);
                handleCloseUpdateModal();
                message.success("Update task succeed");
                onUpdateSuccess(data);
            } else {
                message.error("Token not found");
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
                            label="stt"
                            name="stt"
                            rules={[{ required: true, message: 'Please input your stt!' }]}
                        >
                        <Input type='number' />
                        </Form.Item>
                    </Col>
                   
                    <Col span={24} md={12}>
                        <Form.Item
                            label="name_task"
                            name="name_task"
                            rules={[{ required: true, message: 'Please input your name_task!' }]}
                        >
                            <Input type='text' />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="link_task"
                            name="link_task"
                            rules={[{ required: true, message: 'Please input your link_task!' }]}
                        >
                            <Input type='text' />
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
                </Row>
            </Form>
        </Modal>
    )
}

export default UpdateTask;
