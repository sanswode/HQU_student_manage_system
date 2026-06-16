import { useEffect, useState } from 'react';
import { Card, Table, Button, message, Typography, Modal, Form, Input, Space } from 'antd';
import { PlusOutlined, EditOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';
import { teacherApi } from '../../../services/api';
import { Course } from '../../../types';
import CourseStudents from './CourseStudents';
import CourseStatistics from './CourseStatistics';

const { Title } = Typography;
const { TextArea } = Input;

interface CourseForm {
  name: string;
  description?: string;
}

export default function TeacherCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showStudents, setShowStudents] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await teacherApi.getMyCourses();
      setCourses(res.data.courses);
    } catch (error) {
      message.error('获取课程列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values: CourseForm) => {
    try {
      await teacherApi.createCourse(values);
      message.success('课程创建成功');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.error || '创建失败');
    }
  };

  const handleUpdate = async (values: CourseForm) => {
    if (!editingCourse) return;
    try {
      await teacherApi.updateCourse(editingCourse.id, values);
      message.success('课程更新成功');
      setIsModalOpen(false);
      setEditingCourse(null);
      form.resetFields();
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.error || '更新失败');
    }
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    form.setFieldsValue({
      name: course.name,
      description: course.description,
    });
    setIsModalOpen(true);
  };

  const viewStudents = (course: Course) => {
    setSelectedCourse(course);
    setShowStudents(true);
  };

  const viewStatistics = (course: Course) => {
    setSelectedCourse(course);
    setShowStatistics(true);
  };

  const columns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Course) => (
        <Space>
          <Button
            icon={<TeamOutlined />}
            onClick={() => viewStudents(record)}
          >
            学生
          </Button>
          <Button
            icon={<BarChartOutlined />}
            onClick={() => viewStatistics(record)}
          >
            统计
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>课程管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          创建课程
        </Button>
      </div>
      
      <Card loading={loading}>
        <Table
          dataSource={courses}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingCourse ? '编辑课程' : '创建课程'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCourse(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingCourse ? handleUpdate : handleCreate}
        >
          <Form.Item
            name="name"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="课程名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="课程描述"
          >
            <TextArea rows={4} placeholder="课程描述（可选）" />
          </Form.Item>
        </Form>
      </Modal>

      {selectedCourse && (
        <>
          <CourseStudents
            course={selectedCourse}
            open={showStudents}
            onClose={() => setShowStudents(false)}
          />
          <CourseStatistics
            course={selectedCourse}
            open={showStatistics}
            onClose={() => setShowStatistics(false)}
          />
        </>
      )}
    </div>
  );
}
