from flask import Blueprint, request, jsonify
from app import db
from app.models import User, Student, Teacher
from app.utils.password_utils import PasswordUtils
from app.utils.jwt_utils import JWTUtils

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """用户注册"""
    data = request.get_json()
    
    # 验证必填字段
    required_fields = ['username', 'password', 'role', 'name', 'no']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    
    username = data['username']
    password = data['password']
    role = data['role']
    name = data['name']
    no = data['no']  # 学号或工号
    
    # 验证角色
    if role not in ['student', 'teacher']:
        return jsonify({'error': 'Role must be student or teacher'}), 400
    
    # 检查用户名是否已存在
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409
    
    try:
        # 创建用户
        user = User(
            username=username,
            password_hash=PasswordUtils.hash_password(password),
            role=role,
            name=name
        )
        db.session.add(user)
        db.session.flush()  # 获取user.id
        
        # 创建学生或教师档案
        if role == 'student':
            if Student.query.filter_by(student_no=no).first():
                db.session.rollback()
                return jsonify({'error': 'Student number already exists'}), 409
            profile = Student(user_id=user.id, student_no=no)
        else:
            if Teacher.query.filter_by(teacher_no=no).first():
                db.session.rollback()
                return jsonify({'error': 'Teacher number already exists'}), 409
            profile = Teacher(user_id=user.id, teacher_no=no)
        
        db.session.add(profile)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400
    
    # 查找用户
    user = User.query.filter_by(username=username).first()
    
    if not user or not PasswordUtils.verify_password(password, user.password_hash):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    # 生成JWT令牌
    tokens = JWTUtils.create_tokens(identity=str(user.id))
    
    # 获取额外信息
    profile = None
    if user.role == 'student' and user.student_profile:
        profile = user.student_profile.to_dict()
    elif user.role == 'teacher' and user.teacher_profile:
        profile = user.teacher_profile.to_dict()
    
    return jsonify({
        'message': 'Login successful',
        'access_token': tokens['access_token'],
        'refresh_token': tokens['refresh_token'],
        'user': user.to_dict(),
        'profile': profile
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    """刷新访问令牌"""
    from flask_jwt_extended import jwt_required, get_jwt_identity
    
    @jwt_required(refresh=True)
    def _refresh():
        current_user_id = get_jwt_identity()
        access_token = create_access_token(identity=current_user_id)
        return jsonify({'access_token': access_token}), 200
    
    return _refresh()