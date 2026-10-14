import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import './AdminDashboard.css';

export function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [students, setStudents] = useState([]);
  const [codes, setCodes] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCodes: 0,
    usedCodes: 0,
    availableCodes: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [newCodes, setNewCodes] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAddCodes, setShowAddCodes] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
      
      const { data: codesData } = await supabase
        .from('valid_codes')
        .select('*')
        .order('created_at', { ascending: false });

      setStudents(studentsData || []);
      setCodes(codesData || []);
      
      const totalStudents = (studentsData || []).filter(s => s.role !== 'ADMIN').length;
      const totalCodes = (codesData || []).length;
      const usedCodes = (codesData || []).filter(c => c.is_used).length;
      
      setStats({
        totalStudents,
        totalCodes,
        usedCodes,
        availableCodes: totalCodes - usedCodes
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCodes = async () => {
    if (!newCodes.trim()) {
      setMessage({ type: 'error', text: 'اكتب الأكواد الأول' });
      return;
    }

    const codesList = newCodes
      .split(/[\n,]/)
      .map(c => c.trim())
      .filter(c => c.length > 0);

    if (codesList.length === 0) {
      setMessage({ type: 'error', text: 'مفيش أكواد صالحة' });
      return;
    }

    try {
      const { error } = await supabase
        .from('valid_codes')
        .insert(codesList.map(code => ({ code })));

      if (error) {
        if (error.code === '23505') {
          setMessage({ type: 'error', text: 'بعض الأكواد موجودة بالفعل' });
        } else {
          setMessage({ type: 'error', text: 'حدث خطأ' });
        }
        return;
      }

      setMessage({ type: 'success', text: `تم إضافة ${codesList.length} كود ✓` });
      setNewCodes('');
      setShowAddCodes(false);
      fetchData();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ' });
    }
  };

  const handleDeleteCode = async (codeId, isUsed) => {
    if (isUsed) return;
    if (!confirm('متأكد من مسح الكود؟')) return;

    try {
      await supabase.from('valid_codes').delete().eq('id', codeId);
      setMessage({ type: 'success', text: 'تم المسح ✓' });
      fetchData();
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ' });
    }
  };

  const handleDeleteStudent = async (studentId, studentRole) => {
    if (studentRole === 'ADMIN') return;
    if (!confirm('متأكد من مسح الطالب ده؟')) return;

    try {
      await supabase.from('students').delete().eq('id', studentId);
      setMessage({ type: 'success', text: 'تم المسح ✓' });
      fetchData();
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'النهاردة';
    if (days === 1) return 'امبارح';
    if (days < 7) return `من ${days} أيام`;
    if (days < 30) return `من ${Math.floor(days / 7)} أسابيع`;
    return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="admin-page">
          <div className="admin-loading">
            <div className="spinner"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const realStudents = students.filter(s => s.role !== 'ADMIN');
  const availableCodes = codes.filter(c => !c.is_used);
  const usedCodes = codes.filter(c => c.is_used);

  return (
    <>
      <Header />
      <main className="admin-page">
        <div className="admin-wrapper">
          
          {/* Header */}
          <div className="admin-header">
            <h1>أهلاً {user?.name?.split(' ')[0]} 👋</h1>
            <p>إدارة الطلاب والأكواد</p>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`toast ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Stats Cards */}
          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-num">{stats.totalStudents}</span>
              <span className="stat-txt">طالب</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{stats.availableCodes}</span>
              <span className="stat-txt">كود متاح</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{stats.usedCodes}</span>
              <span className="stat-txt">كود مستخدم</span>
            </div>
          </div>

          {/* Students Section */}
          <section className="admin-section">
            <div className="section-header">
              <h2>👥 الطلاب المسجلين</h2>
              <span className="count">{realStudents.length}</span>
            </div>
            
            {realStudents.length === 0 ? (
              <div className="empty-state">
                <p>مفيش طلاب مسجلين لسه</p>
              </div>
            ) : (
              <div className="cards-grid">
                {realStudents.map(student => (
                  <div key={student.id} className="student-card">
                    <div className="card-avatar">
                      {student.name?.charAt(0) || '?'}
                    </div>
                    <div className="card-info">
                      <h3>{student.name}</h3>
                      <p className="card-code">{student.code}</p>
                      <p className="card-date">سجل {formatDate(student.created_at)}</p>
                    </div>
                    <button 
                      className="card-delete"
                      onClick={() => handleDeleteStudent(student.id, student.role)}
                      title="مسح الطالب"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Codes Section */}
          <section className="admin-section">
            <div className="section-header">
              <h2>🔑 الأكواد المتاحة</h2>
              <button className="add-btn" onClick={() => setShowAddCodes(!showAddCodes)}>
                {showAddCodes ? 'إلغاء' : '+ إضافة أكواد'}
              </button>
            </div>

            {/* Add Codes Form */}
            {showAddCodes && (
              <div className="add-form">
                <textarea
                  value={newCodes}
                  onChange={(e) => setNewCodes(e.target.value)}
                  placeholder="اكتب الأكواد هنا (كود في كل سطر)&#10;20231001&#10;20231002&#10;20231003"
                  rows={4}
                />
                <button className="submit-btn" onClick={handleAddCodes}>
                  إضافة
                </button>
              </div>
            )}

            {availableCodes.length === 0 ? (
              <div className="empty-state">
                <p>مفيش أكواد متاحة - ضيف أكواد جديدة</p>
              </div>
            ) : (
              <div className="codes-list">
                {availableCodes.map(code => (
                  <div key={code.id} className="code-chip">
                    <span>{code.code}</span>
                    <button onClick={() => handleDeleteCode(code.id, code.is_used)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Used Codes Section */}
          {usedCodes.length > 0 && (
            <section className="admin-section">
              <div className="section-header">
                <h2>✓ أكواد مستخدمة</h2>
                <span className="count">{usedCodes.length}</span>
              </div>
              <div className="codes-list used">
                {usedCodes.map(code => (
                  <div key={code.id} className="code-chip used">
                    <span>{code.code}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
