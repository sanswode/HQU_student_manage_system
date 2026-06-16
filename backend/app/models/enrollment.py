from datetime import datetime
from app import db

class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    score = db.Column(db.Float, nullable=True)  # 分数，null表示未评分
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Enrollment student={self.student_id} course={self.course_id}>'
    
    def to_dict(self, include_student=False, include_course=False, include_course_teacher=False):
        data = {
            'id': self.id,
            'student_id': self.student_id,
            'course_id': self.course_id,
            'score': self.score,
            'enrolled_at': self.enrolled_at.isoformat() if self.enrolled_at else None
        }
        if include_student and self.student:
            data['student'] = self.student.to_dict()
        if include_course and self.course:
            data['course'] = self.course.to_dict(include_teacher=include_course_teacher)
        return data
