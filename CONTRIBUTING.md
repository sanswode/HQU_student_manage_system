# 贡献指南

感谢您对项目的关注！以下是参与项目开发的指南。

## 开发环境要求

- Python 3.8+
- Node.js 18+
- Git

## 快速开始

### 1. Fork 项目

点击 GitHub 上的 Fork 按钮创建您自己的项目副本。

### 2. 克隆项目

```bash
git clone https://github.com/YOUR_USERNAME/student-management-system.git
cd student-management-system
```

### 3. 运行初始化脚本

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### 4. 手动安装（可选）

如果脚本运行失败，可以手动安装：

```bash
# 后端
cd backend
pip install -r requirements.txt

# 前端
cd ../frontend
npm install
```

## 开发流程

### 启动开发服务器

**终端1 - 启动后端：**
```bash
cd backend
python run.py
```

**终端2 - 启动前端：**
```bash
cd frontend
npm run dev
```

### 代码规范

#### Python 后端
- 遵循 PEP 8 规范
- 使用类型注解
- 编写 docstring

#### TypeScript 前端
- 使用 ESLint 和 Prettier
- 组件使用函数式编程
- 使用 TypeScript 类型

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

示例：
```bash
git commit -m "feat: 添加学生成绩导出功能"
git commit -m "fix: 修复登录页面样式问题"
```

## 提交 Pull Request

1. 创建新分支：`git checkout -b feature/your-feature`
2. 提交更改：`git commit -m "feat: 添加新功能"`
3. 推送到远程：`git push origin feature/your-feature`
4. 在 GitHub 上创建 Pull Request

## 问题反馈

如果您发现了 bug 或有新功能建议，请通过 [Issues](https://github.com/YOUR_USERNAME/student-management-system/issues) 提交。

## 许可证

本项目采用 MIT 许可证。