from datetime import datetime
from app import db

class Course(db.Model):
    __tablename__ = 'courses'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    enrollments = db.relationship('Enrollment', backref='course', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Course {self.name}>'
    
    def to_dict(self, include_teacher=False):
        data = {
            'id': self.id,
            'name': self.name,
            'teacher_id': self.teacher_id,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if include_teacher and self.teacher:
            data['teacher'] = self.teacher.to_dict()
        return data