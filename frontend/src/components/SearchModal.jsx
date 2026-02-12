import React, { useState, useEffect, useRef } from 'react';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose, language, onNavigate, onOpenDictionary, onOpenLibrary, userEmail }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ bible: [], dictionary: [], maps: [], notes: [] });
    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);

    // Auto-focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    // Cleanup when closing
    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setResults({ bible: [], dictionary: [], maps: [], notes: [] });
        }
    }, [isOpen]);

    // Search Effect (Debounced)
    useEffect(() => {
        if (query.length < 2) {
            setResults({ bible: [], dictionary: [], maps: [], notes: [] });
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const scope = activeTab === 'all' ? 'all' : activeTab;
                const emailParam = userEmail ? `&email=${userEmail}` : '';
                const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}&scope=${scope}${emailParam}`);
                const data = await res.json();

                if (data) {
                    // If searching specific scope, backend might return just that array or the structured object
                    // verify structure
                    if (data.bible || data.dictionary || data.maps || data.notes) {
                        setResults(prev => ({
                            ...prev,
                            ...data
                        }));
                    } else {
                        // Fallback if structure is different
                        console.warn("Unexpected search response", data);
                    }
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsLoading(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [query, activeTab, userEmail]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target.className === 'search-modal-overlay') {
            onClose();
        }
    };

    const hasResults = (category) => results[category] && results[category].length > 0;

    const renderResults = (category, title) => {
        if (!hasResults(category)) return null;
        if (activeTab !== 'all' && activeTab !== category) return null;

        return (
            <div className="result-category">
                <h4>{title}</h4>
                {results[category].map(item => (
                    <div
                        key={`${item.type}-${item.id}`}
                        className="result-item"
                        onClick={() => {
                            if (item.type === 'verse' || item.type === 'verse_note') {
                                // Extract book/chapter/verse from item or item.reference
                                // Backend returns: bookNumber, chapterNumber, verseNumber
                                if (item.bookNumber) {
                                    onNavigate(item.bookNumber, item.chapterNumber, item.verseNumber);
                                    onClose();
                                }
                            } else if (item.type === 'dictionary') {
                                // Open dictionary side panel
                                if (onOpenDictionary) {
                                    onOpenDictionary(item.code);
                                    onClose();
                                }
                            } else if (item.type === 'map') {
                                // Navigate to maps (not implemented full nav yet, maybe just alert for now or assume parent handles it)
                                // Ideally onNavigate should support a page switch
                                alert(`Map navigation to ${item.name} coming soon!`);
                            } else if (item.type === 'study_note') {
                                if (onOpenLibrary) {
                                    onOpenLibrary(item.id);
                                    onClose();
                                }
                            }
                        }}
                    >
                        <div className="result-header">
                            <span className="result-title">
                                {item.type === 'verse' ? item.reference :
                                    item.type === 'dictionary' ? item.headword :
                                        item.type === 'map' ? item.name :
                                            item.type === 'verse_note' ? `Note on ${item.reference}` :
                                                item.title}
                            </span>
                            <span className="result-meta">
                                {item.type === 'verse' ? item.version :
                                    item.type === 'dictionary' ? item.code :
                                        item.type === 'map' ? 'Map' : 'Note'}
                            </span>
                        </div>
                        <div className="result-snippet">
                            {item.type === 'verse' ? item.text :
                                item.type === 'dictionary' ? item.definition :
                                    item.type === 'map' ? item.description :
                                        item.preview}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="search-modal-overlay" onClick={handleBackdropClick}>
            <div className="search-modal-content">
                <div className="search-header">
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            ref={inputRef}
                            type="text"
                            className="search-input"
                            placeholder={language === 'en' ? "Search Bible, Dictionary, Notes..." : "Пошук у Біблії, Словнику, Нотатках..."}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="search-tabs">
                    {['all', 'bible', 'dictionary', 'maps', 'notes'].map(tab => (
                        <button
                            key={tab}
                            className={`search-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'all' ? (language === 'en' ? 'All' : 'Всі') :
                                tab === 'bible' ? (language === 'en' ? 'Bible' : 'Біблія') :
                                    tab === 'dictionary' ? (language === 'en' ? 'Dictionary' : 'Словник') :
                                        tab === 'maps' ? (language === 'en' ? 'Maps' : 'Мапи') :
                                            (language === 'en' ? 'Notes' : 'Нотатки')}
                        </button>
                    ))}
                </div>

                <div className="search-results">
                    {isLoading && <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>Typing...</div>}

                    {!isLoading && query.length >= 2 && (
                        <>
                            {renderResults('bible', language === 'en' ? 'Bible Verses' : 'Вірші Біблії')}
                            {renderResults('dictionary', language === 'en' ? 'Dictionary Definitions' : 'Визначення Словника')}
                            {renderResults('maps', language === 'en' ? 'Locations' : 'Місця')}
                            {renderResults('notes', language === 'en' ? 'Your Notes' : 'Ваші Нотатки')}

                            {!hasResults('bible') && !hasResults('dictionary') && !hasResults('maps') && !hasResults('notes') && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    {language === 'en' ? 'No results found.' : 'Нічого не знайдено.'}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
