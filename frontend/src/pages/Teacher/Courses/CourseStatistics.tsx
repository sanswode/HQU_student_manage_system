import { useEffect, useState } from 'react';
import { Modal, Card, Row, Col, Statistic } from 'antd';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { teacherApi } from '../../../services/api';
import { Course, CourseStatistics as Stats } from '../../../types';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF0000'];

interface Props {
  course: Course;
  open: boolean;
  onClose: () => void;
}

export default function CourseStatistics({ course, open, onClose }: Props) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchStatistics();
    }
  }, [open, course.id]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const res = await teacherApi.getCourseStatistics(course.id);
      setStats(res.data.statistics);
    } catch (error) {
      console.error('获取统计数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  if (!stats) return null;

  const scoreDistribution = [
    { name: '优秀(90-100)', value: stats.score_distribution['90-100'] },
    { name: '良好(80-89)', value: stats.score_distribution['80-89'] },
    { name: '中等(70-79)', value: stats.score_distribution['70-79'] },
    { name: '及格(60-69)', value: stats.score_distribution['60-69'] },
    { name: '不及格(<60)', value: stats.score_distribution['0-59'] },
  ].filter(item => item.value > 0);

  return (
    <Modal
      title={`${course.name} - 统计信息`}
      open={open}
      onCancel={onClose}
      width={900}
      footer={null}
    >
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="选课人数" value={stats.total_students} />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="已评分" value={stats.scored_students} />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="平均分" value={stats.average} precision={2} suffix="分" />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="最高分" value={stats.highest} suffix="分" />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="最低分" value={stats.lowest} suffix="分" />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="及格率" value={stats.pass_rate} precision={2} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="成绩分布" loading={loading}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scoreDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分数段统计" loading={loading}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
}
