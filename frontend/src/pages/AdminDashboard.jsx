import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import './AdminDashboard.css';

export function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('students');
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
  const [searchTerm, setSearchTerm] = useState('');

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

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleAddCodes = async () => {
    if (!newCodes.trim()) {
      showMessage('error', 'اكتب الأكواد الأول');
      return;
    }

    const codesList = newCodes
      .split(/[\n,]/)
      .map(c => c.trim())
      .filter(c => c.length > 0);

    if (codesList.length === 0) {
      showMessage('error', 'مفيش أكواد صالحة');
      return;
    }

    try {
      const { error } = await supabase
        .from('valid_codes')
        .insert(codesList.map(code => ({ code })));

      if (error) {
        if (error.code === '23505') {
          showMessage('error', 'بعض الأكواد موجودة بالفعل');
        } else {
          showMessage('error', 'حدث خطأ');
        }
        return;
      }

      showMessage('success', `تم إضافة ${codesList.length} كود بنجاح`);
      setNewCodes('');
      fetchData();
    } catch (error) {
      showMessage('error', 'حدث خطأ');
    }
  };

  const handleDeleteCode = async (codeId, isUsed) => {
    if (isUsed) {
      showMessage('error', 'مينفعش تمسح كود مستخدم');
      return;
    }
    if (!confirm('متأكد من مسح الكود؟')) return;

    try {
      await supabase.from('valid_codes').delete().eq('id', codeId);
      showMessage('success', 'تم مسح الكود');
      fetchData();
    } catch (error) {
      showMessage('error', 'حدث خطأ');
    }
  };

  const handleDeleteStudent = async (studentId, studentRole) => {
    if (studentRole === 'ADMIN') {
      showMessage('error', 'مينفعش تمسح الأدمن');
      return;
    }
    if (!confirm('متأكد من مسح الطالب ده وكل بياناته؟')) return;

    try {
      await supabase.from('students').delete().eq('id', studentId);
      showMessage('success', 'تم مسح الطالب');
      fetchData();
    } catch (error) {
      showMessage('error', 'حدث خطأ');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'لم يدخل بعد';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days === 1) return 'أمس';
    if (days < 7) return `منذ ${days} أيام`;
    if (days < 30) return `منذ ${Math.floor(days / 7)} أسبوع`;
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredStudents = students.filter(s => 
    s.role !== 'ADMIN' && 
    (s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.code?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCodes = codes.filter(c =>
    c.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="admin-dashboard">
          <div className="dashboard-loading">
            <div className="loader"></div>
            <p>جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const tabs = [
    { id: 'students', label: 'الطلاب', icon: '👥', count: stats.totalStudents },
    { id: 'codes', label: 'الأكواد', icon: '🔑', count: stats.totalCodes },
    { id: 'stats', label: 'الإحصائيات', icon: '📊', count: null },
  ];

  return (
    <>
      <Header />
      <main className="admin-dashboard">
        <div className="dashboard-wrapper">
          
          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="sidebar-header">
              <div className="admin-avatar">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="admin-info">
                <h3>{user?.name}</h3>
                <span>مدير النظام</span>
              </div>
            </div>

            <nav className="sidebar-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="nav-icon">{tab.icon}</span>
                  <span className="nav-label">{tab.label}</span>
                  {tab.count !== null && (
                    <span className="nav-badge">{tab.count}</span>
                  )}
                </button>
              ))}
            </nav>

            <div className="sidebar-footer">
              <button className="refresh-btn" onClick={fetchData}>
                🔄 تحديث البيانات
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="dashboard-main">
            
            {/* Toast */}
            <AnimatePresence>
              {message.text && (
                <motion.div 
                  className={`toast-message ${message.type}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {message.type === 'success' ? '✓' : '✕'} {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Bar */}
            {activeTab !== 'stats' && (
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder={activeTab === 'students' ? 'ابحث باسم الطالب أو الكود...' : 'ابحث بالكود...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
                )}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <motion.div 
                className="tab-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="content-header">
                  <h2>الطلاب المسجلين</h2>
                  <span className="header-count">{filteredStudents.length} طالب</span>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">👥</span>
                    <p>{searchTerm ? 'مفيش نتائج للبحث' : 'مفيش طلاب مسجلين لسه'}</p>
                  </div>
                ) : (
                  <div className="data-table">
                    <div className="table-header">
                      <span>الطالب</span>
                      <span>الكود</span>
                      <span>تاريخ التسجيل</span>
                      <span>آخر دخول</span>
                      <span></span>
                    </div>
                    {filteredStudents.map((student, index) => (
                      <motion.div 
                        key={student.id} 
                        className="table-row"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div className="cell cell-user">
                          <div className="user-avatar" style={{ background: `hsl(${student.name?.charCodeAt(0) * 10 || 200}, 70%, 50%)` }}>
                            {student.name?.charAt(0) || '?'}
                          </div>
                          <span className="user-name">{student.name}</span>
                        </div>
                        <div className="cell cell-code">{student.code}</div>
                        <div className="cell cell-date">{formatDate(student.created_at)}</div>
                        <div className="cell cell-date">{formatDate(student.last_login)}</div>
                        <div className="cell cell-actions">
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteStudent(student.id, student.role)}
                            title="مسح الطالب"
                          >
                            🗑️
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Codes Tab */}
            {activeTab === 'codes' && (
              <motion.div 
                className="tab-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Add Codes Section */}
                <div className="add-section">
                  <h3>إضافة أكواد جديدة</h3>
                  <div className="add-form">
                    <textarea
                      value={newCodes}
                      onChange={(e) => setNewCodes(e.target.value)}
                      placeholder="اكتب الأكواد هنا (كل كود في سطر جديد)&#10;مثال:&#10;20241001&#10;20241002&#10;20241003"
                      rows={4}
                    />
                    <button className="add-btn" onClick={handleAddCodes}>
                      <span>+</span> إضافة الأكواد
                    </button>
                  </div>
                </div>

                {/* Codes List */}
                <div className="content-header">
                  <h2>قائمة الأكواد</h2>
                  <div className="header-filters">
                    <span className="filter-badge available">{stats.availableCodes} متاح</span>
                    <span className="filter-badge used">{stats.usedCodes} مستخدم</span>
                  </div>
                </div>

                {filteredCodes.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">🔑</span>
                    <p>{searchTerm ? 'مفيش نتائج للبحث' : 'مفيش أكواد - ضيف أكواد جديدة'}</p>
                  </div>
                ) : (
                  <div className="codes-grid">
                    {filteredCodes.map((code, index) => (
                      <motion.div 
                        key={code.id} 
                        className={`code-card ${code.is_used ? 'used' : 'available'}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <div className="code-value">{code.code}</div>
                        <div className="code-status">
                          {code.is_used ? (
                            <span className="status used">✓ مستخدم</span>
                          ) : (
                            <span className="status available">متاح</span>
                          )}
                        </div>
                        {!code.is_used && (
                          <button 
                            className="code-delete"
                            onClick={() => handleDeleteCode(code.id, code.is_used)}
                          >
                            ✕
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <motion.div 
                className="tab-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="content-header">
                  <h2>إحصائيات النظام</h2>
                </div>

                <div className="stats-grid">
                  <motion.div 
                    className="stat-card students"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <span className="stat-number">{stats.totalStudents}</span>
                      <span className="stat-label">طالب مسجل</span>
                    </div>
                    <div className="stat-bg">👥</div>
                  </motion.div>

                  <motion.div 
                    className="stat-card codes"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="stat-icon">🔑</div>
                    <div className="stat-content">
                      <span className="stat-number">{stats.totalCodes}</span>
                      <span className="stat-label">إجمالي الأكواد</span>
                    </div>
                    <div className="stat-bg">🔑</div>
                  </motion.div>

                  <motion.div 
                    className="stat-card available"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="stat-icon">✨</div>
                    <div className="stat-content">
                      <span className="stat-number">{stats.availableCodes}</span>
                      <span className="stat-label">كود متاح</span>
                    </div>
                    <div className="stat-bg">✨</div>
                  </motion.div>

                  <motion.div 
                    className="stat-card used"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="stat-icon">✓</div>
                    <div className="stat-content">
                      <span className="stat-number">{stats.usedCodes}</span>
                      <span className="stat-label">كود مستخدم</span>
                    </div>
                    <div className="stat-bg">✓</div>
                  </motion.div>
                </div>

                {/* Recent Activity */}
                <div className="recent-section">
                  <h3>آخر التسجيلات</h3>
                  <div className="recent-list">
                    {students.filter(s => s.role !== 'ADMIN').slice(0, 5).map(student => (
                      <div key={student.id} className="recent-item">
                        <div className="recent-avatar" style={{ background: `hsl(${student.name?.charCodeAt(0) * 10 || 200}, 70%, 50%)` }}>
                          {student.name?.charAt(0)}
                        </div>
                        <div className="recent-info">
                          <span className="recent-name">{student.name}</span>
                          <span className="recent-code">{student.code}</span>
                        </div>
                        <span className="recent-time">{formatDate(student.created_at)}</span>
                      </div>
                    ))}
                    {students.filter(s => s.role !== 'ADMIN').length === 0 && (
                      <p className="no-recent">مفيش تسجيلات لسه</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
