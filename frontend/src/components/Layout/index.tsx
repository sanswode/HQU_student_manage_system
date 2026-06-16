import { Layout, Menu, Button, Avatar, Dropdown, Typography, theme } from 'antd';
import { 
  DashboardOutlined, 
  BookOutlined, 
  BarChartOutlined, 
  LogoutOutlined,
  UserOutlined,
  TeamOutlined,
  MoonOutlined,
  SunOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '../../stores/authStore';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface LayoutProps {
  userType: 'student' | 'teacher';
}

export default function AppLayout({ userType }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 根据用户类型生成菜单
  const getMenuItems = () => {
    if (userType === 'student') {
      return [
        {
          key: '/student',
          icon: <DashboardOutlined />,
          label: '概览',
        },
        {
          key: '/student/courses',
          icon: <BookOutlined />,
          label: '选课',
        },
        {
          key: '/student/statistics',
          icon: <BarChartOutlined />,
          label: '统计',
        },
      ];
    }
    return [
      {
        key: '/teacher',
        icon: <DashboardOutlined />,
        label: '概览',
      },
      {
        key: '/teacher/courses',
        icon: <BookOutlined />,
        label: '课程管理',
      },
      {
        key: '/teacher/students',
        icon: <TeamOutlined />,
        label: '学生查询',
      },
    ];
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible theme={isDarkMode ? 'dark' : 'light'}>
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Text strong style={{ fontSize: 18, color: isDarkMode ? '#fff' : '#000' }}>
            成绩管理系统
          </Text>
        </div>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <div>
            <Text type="secondary">
              欢迎，{user?.name} ({userType === 'student' ? '学生' : '教师'})
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
            >
              {isDarkMode ? '亮色' : '暗色'}
            </Button>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </div>
        </Header>
        <Content style={{ 
          margin: 24, 
          padding: 24, 
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          overflow: 'auto'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
