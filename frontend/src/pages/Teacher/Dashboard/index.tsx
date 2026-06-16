import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, message, Typography } from 'antd';
import { BookOutlined, TeamOutlined } from '@ant-design/icons';
import { teacherApi } from '../../../services/api';
import { Course } from '../../../types';

const { Title } = Typography;

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await teacherApi.getMyCourses();
      setCourses(res.data.courses);
      setStats({
        totalCourses: res.data.courses.length,
        totalStudents: 0, // 可以通过其他API获取
      });
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
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
  ];

  return (
    <div>
      <Title level={2}>教师面板</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic
              title="教授课程"
              value={stats.totalCourses}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="选课学生"
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="我的课程" loading={loading}>
        <Table
          dataSource={courses}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}
