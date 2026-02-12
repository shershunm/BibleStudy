import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Reader from './components/Reader';
import StudyPanel from './components/StudyPanel';
import NotesLibrary from './components/NotesLibrary';
import Settings from './components/Settings';
import SearchModal from './components/SearchModal';

import LoginPage from './components/LoginPage';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('ua');
  const [fontSize, setFontSize] = useState(18);
  const [sideBySide, setSideBySide] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [studyNotes, setStudyNotes] = useState('');
  const [verseNotes, setVerseNotes] = useState({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isStudyPanelCollapsed, setIsStudyPanelCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [dictionaryCode, setDictionaryCode] = useState(null);
  const [studyNotesList, setStudyNotesList] = useState([]); // For the library

  // Dynamic Logo based on theme
  const logoSrc = theme === 'dark' ? '/BibleStudyLogo_darkMode.png' : '/BibleStudyLogo_lightMode.png';

  // Dynamic Favicon
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = theme === 'dark' ? '/BibleStudyFavicon_darkMode2.png' : '/BibleStudyFavicon_lightMode.png';
    }
  }, [theme]);

  // Navigation State
  const [activeBook, setActiveBook] = useState(1); // Genesis
  const [activeChapter, setActiveChapter] = useState(1);

  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogin = (userData, token, studyPad, notes, studyNotes) => {
    setUser({ ...userData, token }); // Store token in user object for simplicity
    localStorage.setItem('user', JSON.stringify({ ...userData, token }));

    if (studyPad) setStudyNotes(studyPad);

    // Convert array of notes to object { verseId: text }
    if (notes && Array.isArray(notes)) {
      const notesMap = {};
      notes.forEach(n => { notesMap[n.verseId] = n.text; });
      setVerseNotes(notesMap);
    }

    if (studyNotes && Array.isArray(studyNotes)) {
      setStudyNotesList(studyNotes);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleAddVerseToNotes = (verseText) => {
    setStudyNotes(prev => prev + (prev ? '\\n\\n' : '') + verseText);
    setActivePage('dashboard'); // Ensure we are on dashboard to see notes
    setIsStudyPanelCollapsed(false); // Auto-expand when adding a verse
  };

  // Persist study notes with debounce
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      fetch('http://localhost:5000/api/user/studypad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, content: studyNotes })
      }).catch(err => console.error('Failed to save study notes', err));
    }, 1000); // 1 sec debounce
    return () => clearTimeout(timer);
  }, [studyNotes, user]);

  const handleUpdateVerseNote = (verseId, note) => {
    setVerseNotes(prev => ({ ...prev, [verseId]: note }));

    if (user) {
      fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, verseId, text: note })
      }).catch(err => console.error('Failed to save verse note', err));
    }
  };

  // Sync user data on mount/login
  useEffect(() => {
    if (user && user.email) {
      fetch(`http://localhost:5000/api/user/${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.studyPad) setStudyNotes(data.studyPad);
          if (data.notes) {
            const notesMap = {};
            data.notes.forEach(n => { notesMap[n.verseId] = n.text; });
            setVerseNotes(notesMap);
          }
          if (data.studyNotes) {
            setStudyNotesList(data.studyNotes);
          }
        })
        .catch(err => console.error('Failed to sync user data', err));
    }
  }, [user?.email]); // Only re-run if email changes

  if (!user) {
    return <LoginPage onLogin={handleLogin} language={language} theme={theme} />;
  }

  return (
    <div className="app-container">
      {/* ... header ... */}
      <header className="global-app-header">
        {/* ... header content ... */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '1.2rem', margin: 0 }}>
              <span style={{ color: theme === 'light' ? 'black' : 'white' }}>
                {language === 'en' ? 'Foundational' : 'Фундаментальне'}
              </span>{' '}
              <span style={{ color: 'var(--accent-primary)' }}>
                {language === 'en' ? 'Bible Study' : 'Вивчення Біблії'}
              </span>
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsSearchOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                marginRight: '10px'
              }}
              title={language === 'en' ? 'Search' : 'Пошук'}
            >
              🔍
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {language === 'en' ? `Welcome, ${user?.name || 'User'}` : `Вітаємо, ${user?.name || 'Користувач'}`}
            </span>
            <button
              onClick={handleLogout}
              className="tab-btn"
              style={{
                padding: '4px 12px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {language === 'en' ? 'Logout' : 'Вийти'}
            </button>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <ErrorBoundary>
          <Sidebar
            currentLanguage={language}
            onLanguageChange={setLanguage}
            theme={theme}
            onThemeToggle={toggleTheme}
            activePage={activePage}
            onPageChange={setActivePage}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            activeBook={activeBook}
            activeChapter={activeChapter}
            onNavigate={(book, chapter) => {
              setActiveBook(book);
              setActiveChapter(chapter);
              if (window.innerWidth < 768) setIsSidebarCollapsed(true); // Auto-close on mobile
            }}
          />



          {activePage === 'dashboard' ? (
            <>
              <Reader
                language={language}
                sideBySide={sideBySide}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                onToggleCompare={() => setSideBySide(!sideBySide)}
                onAddVerseToNotes={handleAddVerseToNotes}
                verseNotes={verseNotes}
                onUpdateVerseNote={handleUpdateVerseNote}
                isSidebarCollapsed={isSidebarCollapsed}
                onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isStudyPanelCollapsed={isStudyPanelCollapsed}
                onToggleStudyPanel={() => setIsStudyPanelCollapsed(!isStudyPanelCollapsed)}
                onStrongClick={(code) => {
                  setDictionaryCode(code);
                  setIsStudyPanelCollapsed(false);
                }}
                activeBook={activeBook}
                activeChapter={activeChapter}
              />
              <StudyPanel
                language={language}
                notes={studyNotes}
                onNotesChange={setStudyNotes}
                isCollapsed={isStudyPanelCollapsed}
                onToggleCollapse={() => setIsStudyPanelCollapsed(!isStudyPanelCollapsed)}
                externalCode={dictionaryCode}
                onExternalCodeClear={() => setDictionaryCode(null)}
                isSidebarCollapsed={isSidebarCollapsed}
                userEmail={user.email}
                onNoteSaved={(newNote) => setStudyNotesList(prev => [newNote, ...prev])}
              />
            </>
          ) : activePage === 'library' ? (
            <NotesLibrary
              language={language}
              notes={studyNotesList}
              userEmail={user.email}
              onNotesUpdate={setStudyNotesList}
            />
          ) : (
            <Settings
              language={language}
              onLanguageChange={setLanguage}
              theme={theme}
              onThemeToggle={toggleTheme}
              onBack={() => setActivePage('dashboard')}
            />
          )}
        </ErrorBoundary>
      </div>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        language={language}
        userEmail={user.email}
        onNavigate={(book, chapter, verse) => {
          setActiveBook(book);
          setActiveChapter(chapter);
          setActivePage('dashboard');
          // Optional: You could scroll to the verse here if Reader supports it
        }}
        onOpenDictionary={(code) => {
          setDictionaryCode(code);
          setIsStudyPanelCollapsed(false);
          setActivePage('dashboard');
        }}
        onOpenLibrary={(noteId) => {
          setActivePage('library');
          // Future: could pass noteId to NotesLibrary to auto-scroll or highlight
        }}
      />
    </div>
  );
}

export default App;
