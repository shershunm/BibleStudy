import React, { useState, useEffect } from 'react';

const Sidebar = ({
    currentLanguage,
    onLanguageChange,
    theme,
    onThemeToggle,
    activePage,
    onPageChange,
    isCollapsed,
    onToggleCollapse,
    activeBook,
    activeChapter,
    onNavigate
}) => {
    const [books, setBooks] = useState([]);
    const [expandedBook, setExpandedBook] = useState(null);

    // Determines which version to use for fetching book names
    // 'UBIO' for Ukrainian, 'KJV' for English
    const versionForNames = currentLanguage === 'ua' ? 'UBIO' : 'KJV';

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/bible/books/${versionForNames}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setBooks(data);
                    // Auto-expand the current active book
                    if (activeBook) {
                        const currentBook = data.find(b => b.number === activeBook);
                        if (currentBook) setExpandedBook(currentBook.id);
                    }
                } else {
                    console.error('Books API returned invalid data:', data);
                    setBooks([]);
                }
            } catch (err) {
                console.error('Failed to fetch books', err);
                setBooks([]);
            }
        };
        fetchBooks();
    }, [versionForNames]); // Re-fetch only when language changes

    // Update expanded book if activeBook changes externally (e.g. navigation)
    useEffect(() => {
        if (!Array.isArray(books) || !books.length) return;
        const currentBook = books.find(b => b.number === activeBook);
        if (currentBook) setExpandedBook(currentBook.id);
    }, [activeBook, books]);

    const handleBookClick = (bookId) => {
        setExpandedBook(expandedBook === bookId ? null : bookId);
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
                <button
                    onClick={onToggleCollapse}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.2rem', padding: '4px' }}
                    title={currentLanguage === 'en' ? 'Collapse Library' : 'Згорнути бібліотеку'}
                >
                    ◀
                </button>
            </div>

            <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        {currentLanguage === 'en' ? 'Library' : 'Бібліотека'}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {books.map(book => (
                            <li key={book.id} style={{ marginBottom: '0.5rem' }}>
                                <div
                                    onClick={() => handleBookClick(book.id)}
                                    style={{
                                        padding: '0.5rem',
                                        color: activeBook === book.number ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: activeBook === book.number ? 'bold' : 'normal',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: activeBook === book.number ? 'var(--bg-tertiary)' : 'transparent',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <span>{book.name}</span>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                                        {expandedBook === book.id ? '▼' : '▶'}
                                    </span>
                                </div>

                                {expandedBook === book.id && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(5, 1fr)',
                                        gap: '4px',
                                        padding: '0.5rem',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '4px',
                                        marginTop: '4px'
                                    }}>
                                        {book.chapters?.map(ch => (
                                            <button
                                                key={ch.number}
                                                onClick={() => onNavigate(book.number, ch.number)}
                                                style={{
                                                    padding: '4px',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '4px',
                                                    background: (activeBook === book.number && activeChapter === ch.number) ? 'var(--accent-primary)' : 'var(--bg-primary)',
                                                    color: (activeBook === book.number && activeChapter === ch.number) ? 'white' : 'var(--text-primary)',
                                                    cursor: 'pointer',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {ch.number}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                    onClick={() => onPageChange('dashboard')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: activePage === 'dashboard' ? 'var(--bg-tertiary)' : 'transparent',
                        color: activePage === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        border: 'none',
                        textAlign: 'left',
                        width: '100%',
                        fontWeight: activePage === 'dashboard' ? '600' : '400'
                    }}
                >
                    <span>📖</span> {currentLanguage === 'en' ? 'Reader' : 'Читання'}
                </button>
                <button
                    onClick={() => onPageChange('library')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: activePage === 'library' ? 'var(--bg-tertiary)' : 'transparent',
                        color: activePage === 'library' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        border: 'none',
                        textAlign: 'left',
                        width: '100%',
                        fontWeight: activePage === 'library' ? '600' : '400'
                    }}
                >
                    <span>📚</span> {currentLanguage === 'en' ? 'Library' : 'Нотатки'}
                </button>
                <button
                    onClick={() => onPageChange('maps')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: activePage === 'maps' ? 'var(--bg-tertiary)' : 'transparent',
                        color: activePage === 'maps' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        border: 'none',
                        textAlign: 'left',
                        width: '100%',
                        fontWeight: activePage === 'maps' ? '600' : '400'
                    }}
                >
                    <span>🗺️</span> {currentLanguage === 'en' ? 'Maps' : 'Карти'}
                </button>
                <button
                    onClick={() => onPageChange('settings')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: activePage === 'settings' ? 'var(--bg-tertiary)' : 'transparent',
                        color: activePage === 'settings' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        border: 'none',
                        textAlign: 'left',
                        width: '100%',
                        fontWeight: activePage === 'settings' ? '600' : '400'
                    }}
                >
                    <span>⚙️</span> {currentLanguage === 'en' ? 'Settings' : 'Налаштування'}
                </button>
            </div>
        </div >
    );
};

export default Sidebar;
