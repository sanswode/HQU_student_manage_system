from app import db

class Teacher(db.Model):
    __tablename__ = 'teachers'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    teacher_no = db.Column(db.String(20), unique=True, nullable=False)
    
    # 关系
    courses = db.relationship('Course', backref='teacher', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Teacher {self.teacher_no}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'teacher_no': self.teacher_no,
            'name': self.user.name if self.user else None,
            'username': self.user.username if self.user else None
        }