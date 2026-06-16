from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Teacher, Student, Course, Enrollment
from sqlalchemy import func

teacher_bp = Blueprint('teacher', __name__)

def get_current_teacher():
    """获取当前登录教师"""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != 'teacher':
        return None
    return user.teacher_profile

@teacher_bp.route('/students', methods=['GET'])
@jwt_required()
def get_students():
    """查询学生信息"""
    teacher = get_current_teacher()
    if not teacher:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # 获取查询参数
    student_no = request.args.get('student_no')
    name = request.args.get('name')
    
    query = Student.query.join(User)
    
    if student_no:
        query = query.filter(Student.student_no.like(f'%{student_no}%'))
    if name:
        query = query.filter(User.name.like(f'%{name}%'))
    
    students = query.all()
    
    return jsonify({
        'students': [s.to_dict() for s in students],
        'total': len(students)
    }), 200

@teacher_bp.route('/courses', methods=['GET'])
@jwt_required()
def get_my_courses():
    """获取教授的课程"""
    teacher = get_current_teacher()
    if not teacher:
        return jsonify({'error': 'Unauthorized'}), 403
    
    courses = teacher.courses.all()
    
    return jsonify({
        'courses': [c.to_dict() for c in courses],
        'total': len(courses)
    }), 200

@teacher_bp.route('/courses', methods=['POST'])
@jwt_required()
def create_course():
    """创建课程"""
    teacher = get_current_teacher()
    if not teacher:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    name = data.get('name')
    description = data.get('description', '')
    
    if not name:
        return jsonify({'error': 'Course name is required'}), 400
    
    try:
        course = Course(
            name=name,
            teacher_id=teacher.id,
            description=description
        )
        db.session.add(course)
        db.session.commit()
        
        return jsonify({
            'message': 'Course created successfully',
            'course': course.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@teacher_bp.route('/courses/<int:course_id>', methods=['PUT'])
@jwt_required()
def update_course(course_id):
    """修改课程信息"""
    teacher = get_current_teacher()
    if not teacher:
        return jsonify({'error': 'Unauthorized'}), 403
    
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    
    if course.teacher_id != teacher.id:
        return jsonify({'error': 'Permission denied'}), 403
    
    data = request.get_json()
    
    if 'name' in data:
        course.name = data['name']
    if 'description' in data:
        course.description = data['description']
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Course updated successfully',
            'course': course.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@teacher_bp.route('/courses/<int:course_id>/students', methods=['GET'])
@jwt_required()
def get_course_students(course_id):
    """获取课程学生列表"""
    teacher = get_current_teacher()
    if not teacher:
        return jsonify({'error': 'Unauthorized'}), 403
    
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    
    if course.teacher_id != teacher.id:
        return jsonify({'error': 'Permission denied'}), 403
    
    enrollments = course.enrollments.all()
    students_data = []
    
    for enrollment in enrollments:
        data = enrollment.to_dict(include_student=True)
        students_data.append(data)
    
    return jsonify({
        'course': course.to_dict(),
        'students': students_data,
        'total': len(students_data)
    }), 200

@teacher_bp.route('/courses/<int:course_id>/scores', methods=['POST'])
@jwt_required()
def set_scores(course_id):
    """设置课程学生分数"""
    teacher = get_current_teacher()
    if not teacher:
        return jsonify({'error': 'Unauthorized'}), 403
    
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    
    if course.teacher_id != teacher.id:
        return jsonify({'error': 'Permission denied'}), 403
    
    data = request.get_json()
    scores = data.get('scores', [])  # [{student_id: 1, score: 85}, ...]
    
    if not scores:
        return jsonify({'error': 'Scores data is required'}), 400
    
    updated = []
    errors = []
    
    for item in scores:
        student_id = item.get('student_id')
        score = item.get('score')
        
        if score is not None and (score < 0 or score > 100):
            errors.append(f'Invalid score for student {student_id}')
            continue
        
        enrollment = Enrollment.query.filter_by(
            course_id=course_id,
            student_id=student_id
        ).first()
        
        if enrollment:
            enrollment.score = score
            updated.append(enrollment.to_dict(include_student=True))
        else:
            errors.append(f'Student {student_id} not enrolled in this course')
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Scores updated successfully',
            'updated': updated,
            'errors': errors
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@teacher_bp.route('/courses/<int:course_id>/statistics', methods=['GET'])
@jwt_required()
def get_course_statistics(course_id):
    """获取课程统计信息"""
    teacher = get_current_teacher()
    if not teacher:
        return jsonify({'error': 'Unauthorized'}), 403
    
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    
    if course.teacher_id != teacher.id:
        return jsonify({'error': 'Permission denied'}), 403
    
    # 获取所有选课记录
    enrollments = course.enrollments.all()
    scores = [e.score for e in enrollments if e.score is not None]
    
    total_students = len(enrollments)
    scored_students = len(scores)
    
    if not scores:
        return jsonify({
            'course': course.to_dict(),
            'statistics': {
                'total_students': total_students,
                'scored_students': 0,
                'average': 0,
                'highest': 0,
                'lowest': 0,
                'pass_rate': 0,
                'excellent_rate': 0  # 90分以上
            }
        }), 200
    
    passed = len([s for s in scores if s >= 60])
    excellent = len([s for s in scores if s >= 90])
    
    # 分数段统计
    ranges = {
        '90-100': len([s for s in scores if 90 <= s <= 100]),
        '80-89': len([s for s in scores if 80 <= s < 90]),
        '70-79': len([s for s in scores if 70 <= s < 80]),
        '60-69': len([s for s in scores if 60 <= s < 70]),
        '0-59': len([s for s in scores if s < 60])
    }
    
    return jsonify({
        'course': course.to_dict(),
        'statistics': {
            'total_students': total_students,
            'scored_students': scored_students,
            'average': round(sum(scores) / len(scores), 2),
            'highest': max(scores),
            'lowest': min(scores),
            'pass_rate': round(passed / len(scores) * 100, 2),
            'excellent_rate': round(excellent / len(scores) * 100, 2),
            'score_distribution': ranges
        }
    }), 200