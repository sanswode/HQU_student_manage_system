import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, message, Typography, Tag } from 'antd';
import { BookOutlined, CheckCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import { studentApi } from '../../../services/api';
import { Enrollment, StudentScoresResponse } from '../../../types';

const { Title } = Typography;

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    scoredCourses: 0,
    average: 0,
  });
  const [courses, setCourses] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const scoresRes = await studentApi.getMyScores();
      const data = scoresRes.data as StudentScoresResponse;
      
      setCourses(data.scores);
      setStats({
        totalCourses: data.statistics.total_courses,
        scoredCourses: data.statistics.scored_courses,
        average: data.statistics.average_score,
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
      dataIndex: ['course', 'name'],
      key: 'courseName',
    },
    {
      title: '教师',
      dataIndex: ['course', 'teacher', 'name'],
      key: 'teacher',
    },
    {
      title: '成绩',
      dataIndex: 'score',
      key: 'score',
      render: (score: number | null) => {
        if (score === null) return <Tag color="default">未评分</Tag>;
        let color = 'green';
        if (score < 60) color = 'red';
        else if (score < 80) color = 'orange';
        return <Tag color={color}>{score}</Tag>;
      },
    },
    {
      title: '选课时间',
      dataIndex: 'enrolled_at',
      key: 'enrolled_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <Title level={2}>学生面板</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="已选课程"
              value={stats.totalCourses}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已评分课程"
              value={stats.scoredCourses}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="平均分"
              value={stats.average}
              precision={2}
              prefix={<BarChartOutlined />}
              suffix="分"
            />
          </Card>
        </Col>
      </Row>

      <Card title="我的课程成绩" loading={loading}>
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
