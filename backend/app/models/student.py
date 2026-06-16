from app import db

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    student_no = db.Column(db.String(20), unique=True, nullable=False)
    
    # 关系
    enrollments = db.relationship('Enrollment', backref='student', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Student {self.student_no}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'student_no': self.student_no,
            'name': self.user.name if self.user else None,
            'username': self.user.username if self.user else None
        }