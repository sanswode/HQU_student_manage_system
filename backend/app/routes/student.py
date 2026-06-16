from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Student, Course, Enrollment, Teacher

student_bp = Blueprint('student', __name__)

def get_current_student():
    """获取当前登录学生"""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user or user.role != 'student':
        return None
    return user.student_profile

@student_bp.route('/courses', methods=['GET'])
@jwt_required()
def get_available_courses():
    """获取可选课程列表"""
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Unauthorized'}), 403
    
    # 获取已选课程ID
    enrolled_course_ids = [e.course_id for e in student.enrollments.all()]
    
    # 获取所有课程（排除已选）
    courses = Course.query.all()
    available_courses = []
    
    for course in courses:
        course_data = course.to_dict(include_teacher=True)
        course_data['is_enrolled'] = course.id in enrolled_course_ids
        if not course_data['is_enrolled']:
            available_courses.append(course_data)
    
    return jsonify({
        'courses': available_courses,
        'enrolled_count': len(enrolled_course_ids)
    }), 200

@student_bp.route('/enroll', methods=['POST'])
@jwt_required()
def enroll_course():
    """选课"""
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    course_id = data.get('course_id')
    
    if not course_id:
        return jsonify({'error': 'course_id is required'}), 400
    
    # 检查课程是否存在
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404
    
    # 检查是否已选
    existing = Enrollment.query.filter_by(
        student_id=student.id,
        course_id=course_id
    ).first()
    
    if existing:
        return jsonify({'error': 'Already enrolled in this course'}), 409
    
    try:
        enrollment = Enrollment(
            student_id=student.id,
            course_id=course_id
        )
        db.session.add(enrollment)
        db.session.commit()
        
        return jsonify({
            'message': 'Enrolled successfully',
            'enrollment': enrollment.to_dict(include_course=True, include_course_teacher=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@student_bp.route('/my-courses', methods=['GET'])
@jwt_required()
def get_my_courses():
    """获取已选课程"""
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Unauthorized'}), 403
    
    enrollments = student.enrollments.all()
    courses_data = []
    
    for enrollment in enrollments:
        course_data = enrollment.to_dict(include_course=True, include_course_teacher=True)
        courses_data.append(course_data)
    
    return jsonify({
        'enrollments': courses_data,
        'total': len(courses_data)
    }), 200

@student_bp.route('/scores', methods=['GET'])
@jwt_required()
def get_my_scores():
    """获取成绩"""
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Unauthorized'}), 403
    
    enrollments = student.enrollments.all()
    scores_data = []
    
    total_score = 0
    scored_count = 0
    
    for enrollment in enrollments:
        data = enrollment.to_dict(include_course=True, include_course_teacher=True)
        scores_data.append(data)
        
        if enrollment.score is not None:
            total_score += enrollment.score
            scored_count += 1
    
    # 计算平均分
    average = total_score / scored_count if scored_count > 0 else 0
    
    return jsonify({
        'scores': scores_data,
        'statistics': {
            'total_courses': len(enrollments),
            'scored_courses': scored_count,
            'average_score': round(average, 2)
        }
    }), 200

@student_bp.route('/statistics', methods=['GET'])
@jwt_required()
def get_my_statistics():
    """获取个人统计"""
    student = get_current_student()
    if not student:
        return jsonify({'error': 'Unauthorized'}), 403
    
    enrollments = student.enrollments.all()
    
    scores = [e.score for e in enrollments if e.score is not None]
    scored_enrollments = [
        enrollment.to_dict(include_course=True, include_course_teacher=True)
        for enrollment in enrollments
        if enrollment.score is not None
    ]
    score_distribution = {
        '90-100': len([s for s in scores if 90 <= s <= 100]),
        '80-89': len([s for s in scores if 80 <= s < 90]),
        '70-79': len([s for s in scores if 70 <= s < 80]),
        '60-69': len([s for s in scores if 60 <= s < 70]),
        '0-59': len([s for s in scores if s < 60])
    }
    
    if not scores:
        return jsonify({
            'total_courses': len(enrollments),
            'scored_courses': 0,
            'average': 0,
            'highest': 0,
            'lowest': 0,
            'pass_rate': 0,
            'scores': [],
            'score_distribution': score_distribution
        }), 200
    
    passed = len([s for s in scores if s >= 60])
    
    return jsonify({
        'total_courses': len(enrollments),
        'scored_courses': len(scores),
        'average': round(sum(scores) / len(scores), 2),
        'highest': max(scores),
        'lowest': min(scores),
        'pass_rate': round(passed / len(scores) * 100, 2),
        'scores': scored_enrollments,
        'score_distribution': score_distribution
    }), 200
