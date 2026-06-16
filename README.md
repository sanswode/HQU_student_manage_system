# 学生成绩管理系统

基于 Python + React 的现代化学生成绩管理系统，采用前后端分离架构，支持 Web 界面访问。

## 功能特性

### 核心功能
- **用户注册/登录** - 支持学生和教师两种角色，JWT认证，密码bcrypt加密
- **教师功能**
  - 查询学生信息（支持按学号、姓名搜索）
  - 创建/修改课程
  - 录入学生成绩
  - 查看课程统计（平均分、及格率、分数分布等）
- **学生功能**
  - 查看可选课程
  - 选课
  - 查询成绩
  - 查看个人统计
- **成绩统计分析** - 可视化图表展示
- **数据持久化** - SQLite数据库存储

### 额外功能
- **暗色/亮色模式** - 一键切换主题
- **响应式设计** - 适配各种设备
- **JWT认证** - 安全的身份验证
- **密码加密** - bcrypt哈希存储

## 技术栈

### 后端
- **框架**: Flask + Flask-SQLAlchemy
- **数据库**: SQLite
- **认证**: JWT (flask-jwt-extended)
- **密码加密**: bcrypt
- **跨域**: flask-cors

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Ant Design 5
- **状态管理**: Zustand
- **路由**: React Router v6
- **HTTP客户端**: Axios
- **图表库**: Recharts

## 快速开始

### 方式一：使用自动初始化脚本（推荐）

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### 方式二：手动安装

#### 1. 克隆项目
```bash
git clone https://github.com/YOUR_USERNAME/student-management-system.git
cd student-management-system
```

#### 2. 安装后端依赖
```bash
cd backend
pip install -r requirements.txt
```

#### 3. 安装前端依赖
```bash
cd ../frontend
npm install
```

#### 4. 启动服务

**终端1 - 启动后端：**
```bash
cd backend
python run.py
```
后端服务将在 http://localhost:5000 运行

**终端2 - 启动前端：**
```bash
cd frontend
npm run dev
```
前端服务将在 http://localhost:5173 运行

#### 5. 访问应用
打开浏览器访问 http://localhost:5173

## 使用说明

### 注册账户
1. 访问登录页面，点击"立即注册"
2. 选择角色（学生/教师）
3. 填写用户名、姓名、学号/工号、密码
4. 点击注册

### 教师操作
1. **创建课程**: 进入"课程管理"页面，点击"创建课程"
2. **查看学生**: 点击课程列表中的"学生"按钮，查看选课学生并录入成绩
3. **查看统计**: 点击"统计"按钮，查看课程成绩分布图表
4. **查询学生**: 进入"学生查询"页面，可按学号或姓名搜索

### 学生操作
1. **选课**: 进入"选课"页面，查看可选课程并点击"选课"按钮
2. **查看成绩**: 在"概览"页面查看已选课程和成绩
3. **查看统计**: 进入"统计"页面，查看个人成绩分析图表

## 项目结构

```
student-management-system/
├── backend/                      # Python后端
│   ├── app/
│   │   ├── models/              # 数据库模型
│   │   ├── routes/              # API路由
│   │   ├── utils/               # 工具函数
│   │   ├── __init__.py
│   │   └── config.py
│   ├── database/                # 数据库文件
│   ├── requirements.txt
│   └── run.py                   # 启动文件
│
├── frontend/                     # React前端
│   ├── src/
│   │   ├── components/          # 通用组件
│   │   ├── pages/               # 页面组件
│   │   ├── services/            # API服务
│   │   ├── stores/              # 状态管理
│   │   ├── types/               # TypeScript类型
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── database/                     # 数据库文件目录
├── setup.bat                     # Windows初始化脚本
├── setup.sh                      # Linux/Mac初始化脚本
├── README.md
├── CONTRIBUTING.md               # 贡献指南
└── .gitignore                    # Git忽略文件
```

## API 文档

### 认证接口
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录

### 学生接口
- `GET /api/student/courses` - 获取可选课程
- `POST /api/student/enroll` - 选课
- `GET /api/student/my-courses` - 获取已选课程
- `GET /api/student/scores` - 获取成绩
- `GET /api/student/statistics` - 获取统计

### 教师接口
- `GET /api/teacher/students` - 查询学生
- `GET /api/teacher/courses` - 获取课程列表
- `POST /api/teacher/courses` - 创建课程
- `PUT /api/teacher/courses/:id` - 更新课程
- `GET /api/teacher/courses/:id/students` - 获取课程学生
- `POST /api/teacher/courses/:id/scores` - 设置成绩
- `GET /api/teacher/courses/:id/statistics` - 获取统计

## 开发说明

### 后端开发
- 使用 Flask Blueprint 组织路由
- SQLAlchemy ORM 进行数据库操作
- JWT 进行身份认证
- 所有 API 返回 JSON 格式数据

### 前端开发
- 使用 React Hooks 进行状态管理
- Zustand 进行全局状态管理
- Ant Design 组件库构建 UI
- Recharts 绘制统计图表
- 支持暗色/亮色主题切换

## 贡献指南

欢迎提交 Issue 和 Pull Request！

请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与项目开发。

## 注意事项

1. **开发环境**: 当前配置为开发环境，生产环境需要修改配置
2. **数据库**: 使用 SQLite，如需更换数据库请修改 `backend/app/config.py`
3. **跨域**: 开发环境已开启 CORS，生产环境需要配置正确的跨域策略
4. **安全**: 生产环境需要更换 JWT 密钥和密码加密密钥

## 许可证

MIT License

---

**如果觉得项目有用，请给个 Star ⭐️ 支持一下！**