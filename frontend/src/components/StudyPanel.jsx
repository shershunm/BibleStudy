import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const StudyPanel = ({
    language,
    notes,
    onNotesChange,
    isCollapsed,
    onToggleCollapse,
    externalCode,
    onExternalCodeClear,
    userEmail,
    onNoteSaved
}) => {
    const [activeTab, setActiveTab] = useState('dictionary');
    const [searchTerm, setSearchTerm] = useState('');
    const [dictionaryEntry, setDictionaryEntry] = useState(null);
    const [mapLocations, setMapLocations] = useState([]);
    const [loading, setLoading] = useState(false);

    // Dictionary search
    const handleSearch = async (codeToSearch) => {
        const term = codeToSearch || searchTerm;
        if (!term) return;
        setLoading(true);
        try {
            // Strong's codes usually start with H or G
            const code = term.match(/^[HG]\d+/i) ? term : `H${term}`;
            const res = await fetch(`http://localhost:5000/api/dictionary/${code}`);
            if (res.ok) {
                const data = await res.json();
                setDictionaryEntry(data);
                if (codeToSearch) {
                    setSearchTerm(code); // Sync input if searched externally
                    setActiveTab('dictionary');
                }
            } else {
                setDictionaryEntry(null);
            }
        } catch (err) {
            console.error('Search failed', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle external search from Reader
    useEffect(() => {
        if (externalCode) {
            handleSearch(externalCode);
            onExternalCodeClear?.(); // Clear the signal after consumption
        }
    }, [externalCode]);

    // Fetch map locations
    useEffect(() => {
        if (activeTab === 'map') {
            const fetchMaps = async () => {
                try {
                    const res = await fetch('http://localhost:5000/api/maps/locations');
                    const data = await res.json();
                    setMapLocations(data);
                } catch (err) {
                    console.error('Failed to fetch maps', err);
                }
            };
            fetchMaps();
        }
    }, [activeTab]);

    const handleSaveToLibrary = async () => {
        if (!notes || !notes.trim()) return;

        const defaultTitle = language === 'ua'
            ? `Нотатка від ${new Date().toLocaleDateString()}`
            : `Note from ${new Date().toLocaleDateString()}`;

        const title = window.prompt(
            language === 'ua' ? 'Введіть назву нотатки:' : 'Enter note title:',
            defaultTitle
        );

        if (!title) return; // User cancelled

        try {
            const res = await fetch('http://localhost:5000/api/notes/library', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail,
                    title,
                    content: notes
                })
            });

            if (res.ok) {
                const newNote = await res.json();
                if (onNoteSaved) onNoteSaved(newNote);
                alert(language === 'ua' ? 'Нотатку збережено в бібліотеку!' : 'Note saved to library!');
            } else {
                alert(language === 'ua' ? 'Помилка збереження' : 'Error saving note');
            }
        } catch (err) {
            console.error('Failed to save to library', err);
            alert(language === 'ua' ? 'Помилка збереження' : 'Error saving note');
        }
    };

    return (
        <div className={`study-panel ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="tab-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        className={`tab-btn ${activeTab === 'dictionary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dictionary')}
                    >
                        {language === 'en' ? 'Dict' : 'Словник'}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
                        onClick={() => setActiveTab('map')}
                    >
                        {language === 'en' ? 'Map' : 'Карта'}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        {language === 'en' ? 'Notes' : 'Нотатки'}
                    </button>
                </div>
                <button
                    onClick={onToggleCollapse}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}
                    title={language === 'en' ? 'Hide Study Tools' : 'Сховати інструменти'}
                >
                    ▶
                </button>
            </div>

            <div className="panel-content">
                {activeTab === 'dictionary' && (
                    <div className="dictionary-view">
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{language === 'en' ? 'Dictionary' : 'Словник'}</h4>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder={language === 'en' ? "e.g. H7225..." : "напр. H7225..."}
                                style={{ flex: 1, padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                            />
                            <button onClick={handleSearch} style={{ padding: '0 12px', borderRadius: '4px', cursor: 'pointer', background: 'var(--accent-primary)', color: 'white', border: 'none' }}>
                                🔍
                            </button>
                        </div>

                        {loading ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{language === 'en' ? 'Searching...' : 'Пошук...'}</p>
                        ) : dictionaryEntry ? (
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <p style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                                    {dictionaryEntry.headword} ({dictionaryEntry.code})
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{dictionaryEntry.transliteration} | {dictionaryEntry.pronunciation}</p>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--bg-tertiary)', margin: '0.5rem 0' }} />
                                <p style={{ lineHeight: '1.4' }}>{dictionaryEntry.definition}</p>
                            </div>
                        ) : searchTerm && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{language === 'en' ? 'No entry found.' : 'Нічого не знайдено.'}</p>
                        )}

                        {!searchTerm && !dictionaryEntry && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
                                {language === 'en' ? 'Search for a Strong\'s number to see definitions.' : 'Шукайте за номером Стронга.'}
                            </p>
                        )}
                    </div>
                )}

                {activeTab === 'map' && (
                    <div className="map-view">
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{language === 'en' ? 'Biblical Geography' : 'Біблійна географія'}</h4>
                        <div style={{ width: '100%', height: '250px', backgroundColor: '#d0e1f9', borderRadius: '8px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            {mapLocations.map((loc, idx) => (
                                <div
                                    key={loc.id}
                                    style={{
                                        position: 'absolute',
                                        top: `${40 + (idx * 20)}%`,
                                        left: `${30 + (idx * 20)}%`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{ width: '8px', height: '8px', backgroundColor: 'red', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#333', backgroundColor: 'rgba(255,255,255,0.7)', padding: '1px 3px', borderRadius: '2px' }}>
                                        {loc.name}
                                    </span>
                                </div>
                            ))}
                            <div style={{ position: 'absolute', bottom: '8px', width: '100%', textAlign: 'center', color: '#4a90e2', fontSize: '0.7rem' }}>
                                {language === 'en' ? 'Interactive Concept Map' : 'Концептуальна карта'}
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            {mapLocations.map(loc => (
                                <div key={loc.id} style={{ marginBottom: '0.8rem', padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                                    <h5 style={{ margin: 0, fontSize: '0.85rem' }}>{loc.name}</h5>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{loc.description}</p>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.65rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{loc.biblicalEra}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div className="notes-view">
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{language === 'en' ? 'Sermon Notes' : 'Нотатки до проповіді'}</h4>
                        <ReactQuill
                            theme="snow"
                            value={notes}
                            onChange={onNotesChange}
                            placeholder={language === 'en' ? "Start typing your notes here..." : "Почніть писати свої нотатки тут..."}
                            style={{ height: '300px', marginBottom: '50px' }}
                            modules={{
                                toolbar: [
                                    [{ 'header': [1, 2, 3, false] }],
                                    ['bold', 'italic', 'underline'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    [{ 'align': [] }],
                                    ['clean']
                                ]
                            }}
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                            <button style={{ flex: 1, padding: '8px', fontSize: '0.8rem', borderRadius: '4px' }}>
                                {language === 'en' ? 'Export to PDF' : 'Експортувати в PDF'}
                            </button>
                            <button
                                onClick={handleSaveToLibrary}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    fontSize: '0.8rem',
                                    borderRadius: '4px',
                                    backgroundColor: 'var(--accent-primary)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {language === 'en' ? 'Save to Library' : 'Зберегти в бібліотеку'}
                            </button>
                            <button style={{ flex: 1, padding: '8px', fontSize: '0.8rem', borderRadius: '4px' }}>
                                {language === 'en' ? 'Save to Drive' : 'Зберегти на Диск'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyPanel;
