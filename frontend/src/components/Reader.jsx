import React, { useState, useEffect } from 'react';

const Reader = ({
    language,
    sideBySide,
    fontSize,
    onFontSizeChange,
    onToggleCompare,
    onAddVerseToNotes,
    verseNotes,
    onUpdateVerseNote,
    isSidebarCollapsed,
    onToggleSidebar,
    isStudyPanelCollapsed,
    onToggleStudyPanel,
    onStrongClick,
    activeBook,
    activeChapter
}) => {
    const [availableVersions, setAvailableVersions] = useState([]);
    const [versionLeft, setVersionLeft] = useState('UBIO');
    const [versionRight, setVersionRight] = useState('KJV');
    const [chapterLeft, setChapterLeft] = useState(null);
    const [chapterRight, setChapterRight] = useState(null);
    const [activeVerseNote, setActiveVerseNote] = useState(null);
    const [loading, setLoading] = useState(false);

    // Initial load: Fetch versions
    useEffect(() => {
        const fetchVersions = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/bible/versions');
                const data = await res.json();

                if (Array.isArray(data)) {
                    setAvailableVersions(data);
                    // Set defaults based on language if not already set
                    if (data.length > 0) {
                        // Logic to set defaults if needed, but we have separate logic below
                    }

                    // Set defaults based on language
                    if (language === 'ua') {
                        setVersionLeft('UBIO');
                        setVersionRight('KJV');
                    } else {
                        setVersionLeft('KJV');
                        setVersionRight('UBIO');
                    }
                } else {
                    console.error('Versions API returned invalid data:', data);
                    setAvailableVersions([]);
                }
            } catch (err) {
                console.error('Failed to fetch versions', err);
                setAvailableVersions([]);
            }
        };
        fetchVersions();
    }, []);

    // Fetch Chapter Left
    useEffect(() => {
        const fetchChapter = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5000/api/bible/chapter/${versionLeft}/${activeBook}/${activeChapter}`);
                const data = await res.json();
                if (res.ok) {
                    setChapterLeft(data);
                } else {
                    console.error('API Error:', data);
                    setChapterLeft(null);
                }
            } catch (err) {
                console.error('Failed to fetch left chapter', err);
            } finally {
                setLoading(false);
            }
        };
        if (versionLeft && activeBook && activeChapter) fetchChapter();
    }, [versionLeft, activeBook, activeChapter]);

    // Fetch Chapter Right (if sideBySide)
    useEffect(() => {
        if (!sideBySide) return;
        const fetchChapter = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/bible/chapter/${versionRight}/${activeBook}/${activeChapter}`);
                const data = await res.json();
                if (res.ok) {
                    setChapterRight(data);
                } else {
                    setChapterRight(null);
                }
            } catch (err) {
                console.error('Failed to fetch right chapter', err);
            }
        };
        if (versionRight && activeBook && activeChapter) fetchChapter();
    }, [versionRight, sideBySide, activeBook, activeChapter]);

    const VersionSelector = ({ value, onChange }) => (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                fontWeight: 'bold'
            }}
        >
            {availableVersions?.map(v => (
                <option key={v.code} value={v.code}>
                    {v.name} ({v.language.toUpperCase()})
                </option>
            ))}
        </select>
    );

    const VerseActions = ({ verse }) => (
        <div style={{ display: 'flex', gap: '4px', opacity: 0.6 }}>
            <button
                title={language === 'en' ? "Add to Study Notes" : "Додати до нотаток"}
                onClick={() => onAddVerseToNotes(`[${verse.number}] ${verse.text}`)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', fontSize: '0.9rem' }}
            >
                ➕
            </button>
            <button
                title={language === 'en' ? "Verse Note" : "Замітка до вірша"}
                onClick={() => setActiveVerseNote(activeVerseNote === verse.id ? null : verse.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', fontSize: '0.9rem' }}
            >
                📝
            </button>
        </div>
    );

    const VerseNoteEditor = ({ verseId }) => (
        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            <textarea
                value={verseNotes[verseId] || ''}
                onChange={(e) => onUpdateVerseNote(verseId, e.target.value)}
                placeholder={language === 'en' ? "Your note for this verse..." : "Ваша замітка до цього вірша..."}
                style={{ width: '100%', minHeight: '60px', padding: '8px', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '0.85rem', resize: 'vertical' }}
            />
        </div>
    );

    const currentBookName = chapterLeft?.bookName || (language === 'en' ? 'Loading...' : 'Завантаження...');

    // Helper to parse text with Strong's numbers: "In <H7225> the beginning"
    const renderVerseText = (text) => {
        if (!text) return null;
        // Regex to match <H1234> or <G1234>
        const parts = text.split(/(<[HG]\d+>)/g);

        return parts.map((part, index) => {
            if (part.match(/^<[HG]\d+>$/)) {
                const code = part.replace(/[<>]/g, '');
                return (
                    <sup
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            onStrongClick?.(code);
                        }}
                        style={{
                            color: 'var(--accent-primary)',
                            cursor: 'pointer',
                            fontSize: '0.6em',
                            fontWeight: 'bold',
                            marginLeft: '2px',
                            marginRight: '2px'
                        }}
                        title={`View Strong's ${code}`}
                    >
                        {code}
                    </sup>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="reader-container" style={{ '--reader-font-size': `${fontSize}px` }}>
            <header className="reader-header">
                <div className="top-row">
                    {isSidebarCollapsed && (
                        <button
                            className="sidebar-toggle-btn"
                            onClick={onToggleSidebar}
                            title={language === 'en' ? 'Show Library' : 'Показати бібліотеку'}
                        >
                            ▶
                        </button>
                    )}

                    <h2 style={{ fontSize: '1.4rem' }}>{currentBookName} {activeChapter}</h2>

                    {isStudyPanelCollapsed && (
                        <button
                            className="studypanel-toggle-btn"
                            onClick={onToggleStudyPanel}
                            title={language === 'en' ? 'Show Study Tools' : 'Показати інструменти'}
                        >
                            ◀
                        </button>
                    )}
                </div>

                <div className={`sub-row ${sideBySide ? 'compare' : ''}`} style={!sideBySide ? { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' } : {}}>
                    {sideBySide ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <VersionSelector value={versionLeft} onChange={setVersionLeft} />
                            </div>
                            <button
                                className="tab-btn active"
                                onClick={onToggleCompare}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {language === 'en' ? 'Single View' : 'Один переклад'}
                            </button>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <VersionSelector value={versionRight} onChange={setVersionRight} />
                            </div>
                        </>
                    ) : (
                        <>
                            <VersionSelector value={versionLeft} onChange={setVersionLeft} />
                            <button
                                className="tab-btn"
                                onClick={onToggleCompare}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {language === 'en' ? 'Compare View' : 'Порівняти'}
                            </button>
                        </>
                    )}
                </div>
            </header>

            <main className={`reader-content ${sideBySide ? 'side-by-side' : ''} ${(!sideBySide && isSidebarCollapsed && isStudyPanelCollapsed) ? 'full-width' : ''}`}>
                {loading && !chapterLeft ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        {language === 'en' ? 'Loading Scripture...' : 'Завантаження Писання...'}
                    </div>
                ) : sideBySide ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {chapterLeft?.verses?.map((v, index) => {
                            const rightVerse = chapterRight?.verses?.find(rv => rv.number === v.number);
                            return (
                                <div key={v.id} className="compare-grid" style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--bg-tertiary)' }}>
                                    <div className="verse" style={{ margin: 0 }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                            <span className="verse-num">{v.number}</span>
                                            <div style={{ flex: 1 }}>
                                                {renderVerseText(v.text)}
                                                <VerseActions verse={v} />
                                                {activeVerseNote === v.id && <VerseNoteEditor verseId={v.id} />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="verse" style={{ margin: 0 }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                            <span className="verse-num">{v.number}</span>
                                            <div style={{ flex: 1 }}>
                                                {rightVerse ? renderVerseText(rightVerse.text) : '...'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="single-column">
                        {chapterLeft?.verses?.map(v => (
                            <div key={v.id} className="verse">
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <span className="verse-num">{v.number}</span>
                                    <div style={{ flex: 1 }}>
                                        {renderVerseText(v.text)}
                                        <VerseActions verse={v} />
                                        {activeVerseNote === v.id && <VerseNoteEditor verseId={v.id} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="reader-footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{language === 'en' ? 'Text Size' : 'Розмір тексту'}</span>
                    <input
                        type="range" min="14" max="42" value={fontSize}
                        onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                        style={{ width: '150px' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{fontSize}px</span>
                </div>
            </footer>
        </div>
    );
};

export default Reader;
