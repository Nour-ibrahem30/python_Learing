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
  
  const [activeTab, setActiveTab] = useState('stats');
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

  // Check if user is admin
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
      // Fetch students
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fetch codes
      const { data: codesData } = await supabase
        .from('valid_codes')
        .select('*')
        .order('created_at', { ascending: false });

      setStudents(studentsData || []);
      setCodes(codesData || []);
      
      // Calculate stats
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
      setMessage({ type: 'error', text: 'من فضلك اكتب الأكواد' });
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
          setMessage({ type: 'error', text: 'حدث خطأ في إضافة الأكواد' });
        }
        return;
      }

      setMessage({ type: 'success', text: `تم إضافة ${codesList.length} كود بنجاح` });
      setNewCodes('');
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ' });
    }
  };

  const handleDeleteCode = async (codeId, isUsed) => {
    if (isUsed) {
      setMessage({ type: 'error', text: 'مينفعش تمسح كود مستخدم' });
      return;
    }

    if (!confirm('متأكد إنك عايز تمسح الكود ده؟')) return;

    try {
      await supabase.from('valid_codes').delete().eq('id', codeId);
      setMessage({ type: 'success', text: 'تم مسح الكود' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في مسح الكود' });
    }
  };

  const handleDeleteStudent = async (studentId, studentRole) => {
    if (studentRole === 'ADMIN') {
      setMessage({ type: 'error', text: 'مينفعش تمسح الأدمن' });
      return;
    }

    if (!confirm('متأكد إنك عايز تمسح الطالب ده؟ ده هيمسح كل بياناته')) return;

    try {
      await supabase.from('students').delete().eq('id', studentId);
      setMessage({ type: 'success', text: 'تم مسح الطالب' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في مسح الطالب' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="admin-dashboard">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="admin-dashboard">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>لوحة التحكم</h1>
            <p>أهلاً {user?.name} 👋</p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
              <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
            </div>
          )}

          <div className="dashboard-tabs">
            <button 
              className={activeTab === 'stats' ? 'active' : ''} 
              onClick={() => setActiveTab('stats')}
            >
              📊 الإحصائيات
            </button>
            <button 
              className={activeTab === 'codes' ? 'active' : ''} 
              onClick={() => setActiveTab('codes')}
            >
              🔑 الأكواد
            </button>
            <button 
              className={activeTab === 'students' ? 'active' : ''} 
              onClick={() => setActiveTab('students')}
            >
              👥 الطلاب
            </button>
          </div>

          <div className="dashboard-content">
            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalStudents}</span>
                    <span className="stat-label">طالب مسجل</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🔑</div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalCodes}</span>
                    <span className="stat-label">إجمالي الأكواد</span>
                  </div>
                </div>
                <div className="stat-card success">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.usedCodes}</span>
                    <span className="stat-label">كود مستخدم</span>
                  </div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.availableCodes}</span>
                    <span className="stat-label">كود متاح</span>
                  </div>
                </div>
              </div>
            )}

            {/* Codes Tab */}
            {activeTab === 'codes' && (
              <div className="codes-section">
                <div className="add-codes-form">
                  <h3>إضافة أكواد جديدة</h3>
                  <textarea
                    value={newCodes}
                    onChange={(e) => setNewCodes(e.target.value)}
                    placeholder="اكتب الأكواد (كود في كل سطر أو مفصولة بفاصلة)&#10;مثال:&#10;20231001&#10;20231002&#10;20231003"
                    rows={5}
                  />
                  <button className="add-btn" onClick={handleAddCodes}>
                    إضافة الأكواد
                  </button>
                </div>

                <div className="codes-list">
                  <h3>الأكواد ({codes.length})</h3>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>الكود</th>
                          <th>الحالة</th>
                          <th>تاريخ الإنشاء</th>
                          <th>تاريخ الاستخدام</th>
                          <th>إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {codes.map(code => (
                          <tr key={code.id} className={code.is_used ? 'used' : ''}>
                            <td className="code-cell">{code.code}</td>
                            <td>
                              <span className={`status ${code.is_used ? 'used' : 'available'}`}>
                                {code.is_used ? 'مستخدم' : 'متاح'}
                              </span>
                            </td>
                            <td>{formatDate(code.created_at)}</td>
                            <td>{formatDate(code.used_at)}</td>
                            <td>
                              <button 
                                className="delete-btn"
                                onClick={() => handleDeleteCode(code.id, code.is_used)}
                                disabled={code.is_used}
                                title={code.is_used ? 'مينفعش تمسح كود مستخدم' : 'مسح الكود'}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="students-section">
                <h3>الطلاب المسجلين ({students.filter(s => s.role !== 'ADMIN').length})</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>الاسم</th>
                        <th>الكود</th>
                        <th>الدور</th>
                        <th>تاريخ التسجيل</th>
                        <th>آخر دخول</th>
                        <th>إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student.id} className={student.role === 'ADMIN' ? 'admin-row' : ''}>
                          <td>{student.name}</td>
                          <td className="code-cell">{student.code}</td>
                          <td>
                            <span className={`role ${student.role.toLowerCase()}`}>
                              {student.role === 'ADMIN' ? 'أدمن' : 'طالب'}
                            </span>
                          </td>
                          <td>{formatDate(student.created_at)}</td>
                          <td>{formatDate(student.last_login)}</td>
                          <td>
                            {student.role !== 'ADMIN' && (
                              <button 
                                className="delete-btn"
                                onClick={() => handleDeleteStudent(student.id, student.role)}
                                title="مسح الطالب"
                              >
                                🗑️
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
