import { useEffect, useState } from 'react';
import { Modal, Table, Button, InputNumber, message } from 'antd';
import { teacherApi } from '../../../services/api';
import { Course, Enrollment } from '../../../types';

interface Props {
  course: Course;
  open: boolean;
  onClose: () => void;
}

export default function CourseStudents({ course, open, onClose }: Props) {
  const [students, setStudents] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scores, setScores] = useState<Record<number, number | null>>({});

  useEffect(() => {
    if (open) {
      fetchStudents();
    }
  }, [open, course.id]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await teacherApi.getCourseStudents(course.id);
      setStudents(res.data.students);
      // 初始化分数
      const initialScores: Record<number, number | null> = {};
      res.data.students.forEach((s: Enrollment) => {
        initialScores[s.student_id] = s.score;
      });
      setScores(initialScores);
    } catch (error) {
      message.error('获取学生列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (studentId: number, value: number | null) => {
    setScores(prev => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSaveScores = async () => {
    setSaving(true);
    try {
      const scoresData = Object.entries(scores).map(([studentId, score]) => ({
        student_id: parseInt(studentId),
        score,
      }));

      await teacherApi.setScores(course.id, scoresData);
      message.success('成绩保存成功');
      fetchStudents();
    } catch (error: any) {
      message.error(error.response?.data?.error || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: '学号',
      dataIndex: ['student', 'student_no'],
      key: 'student_no',
    },
    {
      title: '姓名',
      dataIndex: ['student', 'name'],
      key: 'name',
    },
    {
      title: '成绩',
      key: 'score',
      render: (_: any, record: Enrollment) => (
        <InputNumber
          min={0}
          max={100}
          value={scores[record.student_id]}
          onChange={(value) => handleScoreChange(record.student_id, value)}
          placeholder="未评分"
          style={{ width: 100 }}
        />
      ),
    },
  ];

  return (
    <Modal
      title={`${course.name} - 学生列表`}
      open={open}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={saving}
          onClick={handleSaveScores}
        >
          保存成绩
        </Button>,
      ]}
    >
      <Table
        dataSource={students}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
      />
    </Modal>
  );
}
