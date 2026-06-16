import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Radio } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/api';

const { Title } = Typography;

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'teacher';
  name: string;
  no: string;
}

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterForm) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        username: values.username,
        password: values.password,
        role: values.role,
        name: values.name,
        no: values.no,
      });
      
      message.success('注册成功！请登录');
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.error || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card style={{ width: 450, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>注册账户</Title>
          <Typography.Text type="secondary">创建您的新账户</Typography.Text>
        </div>
        
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          initialValues={{ role: 'student' }}
        >
          <Form.Item
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Radio.Group onChange={(e) => setRole(e.target.value)} block>
              <Radio.Button value="student" style={{ width: '50%', textAlign: 'center' }}>学生</Radio.Button>
              <Radio.Button value="teacher" style={{ width: '50%', textAlign: 'center' }}>教师</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
            />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="真实姓名" 
            />
          </Form.Item>

          <Form.Item
            name="no"
            rules={[{ required: true, message: `请输入${role === 'student' ? '学号' : '工号'}` }]}
          >
            <Input 
              prefix={<IdcardOutlined />} 
              placeholder={role === 'student' ? '学号' : '工号'} 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: '请确认密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              注册
            </Button>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
            <Typography.Text>
              已有账户？ <Link to="/login">立即登录</Link>
            </Typography.Text>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
