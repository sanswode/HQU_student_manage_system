import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { studentApi } from '../../../services/api';
import { StudentStatisticsResponse } from '../../../types';

const { Title } = Typography;

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF0000'];

export default function StudentStatistics() {
  const [stats, setStats] = useState<StudentStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await studentApi.getMyStatistics();
      setStats(res.data as StudentStatisticsResponse);
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
    <div>
      <Title level={2}>成绩统计</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic title="总课程数" value={stats.total_courses} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic title="已评分" value={stats.scored_courses} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic title="平均分" value={stats.average} precision={2} suffix="分" />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic title="及格率" value={stats.pass_rate} precision={2} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="成绩分布" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
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
          <Card title="分数概览" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: '最高分', value: stats.highest },
                { name: '最低分', value: stats.lowest },
                { name: '平均分', value: stats.average },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
