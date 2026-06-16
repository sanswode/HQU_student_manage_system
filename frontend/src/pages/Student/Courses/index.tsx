import { useEffect, useState } from 'react';
import { Card, Table, Button, message, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { studentApi } from '../../../services/api';
import { Course } from '../../../types';

const { Title } = Typography;

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [availableRes, myRes] = await Promise.all([
        studentApi.getAvailableCourses(),
        studentApi.getMyCourses(),
      ]);
      
      setCourses(availableRes.data.courses);
      setMyCourses(myRes.data.enrollments.map((e: any) => e.course_id));
    } catch (error) {
      message.error('获取课程列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: number) => {
    setEnrolling(courseId);
    try {
      await studentApi.enrollCourse(courseId);
      message.success('选课成功！');
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.error || '选课失败');
    } finally {
      setEnrolling(null);
    }
  };

  const columns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '教师',
      dataIndex: ['teacher', 'name'],
      key: 'teacher',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Course) => (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          loading={enrolling === record.id}
          disabled={myCourses.includes(record.id)}
          onClick={() => handleEnroll(record.id)}
        >
          {myCourses.includes(record.id) ? '已选' : '选课'}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>可选课程</Title>
      
      <Card loading={loading}>
        <Table
          dataSource={courses}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
