import { useEffect, useState } from 'react';
import { Card, Table, Input, Button, message, Typography, Space, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { teacherApi } from '../../../services/api';
import { Student } from '../../../types';

const { Title } = Typography;
export default function TeacherStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    student_no: '',
    name: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (params = {}) => {
    setLoading(true);
    try {
      const res = await teacherApi.getStudents(params);
      setStudents(res.data.students);
    } catch (error) {
      message.error('获取学生列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params: any = {};
    if (searchParams.student_no) params.student_no = searchParams.student_no;
    if (searchParams.name) params.name = searchParams.name;
    fetchStudents(params);
  };

  const handleReset = () => {
    setSearchParams({ student_no: '', name: '' });
    fetchStudents();
  };

  const columns = [
    {
      title: '学号',
      dataIndex: 'student_no',
      key: 'student_no',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
  ];

  return (
    <div>
      <Title level={2}>学生查询</Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder="学号"
              value={searchParams.student_no}
              onChange={(e) => setSearchParams(prev => ({ ...prev, student_no: e.target.value }))}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="姓名"
              value={searchParams.name}
              onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card loading={loading}>
        <Table
          dataSource={students}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
