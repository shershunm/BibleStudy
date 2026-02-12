import React from 'react';

const Settings = ({ language, onLanguageChange, defaultVersion, theme, onThemeToggle, onBack }) => {
    return (
        <div style={{ padding: '2rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="icon-btn" onClick={onBack} style={{ border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                    ←
                </button>
                <h1 style={{ fontSize: '1.5rem' }}>{language === 'en' ? 'Settings' : 'Налаштування'}</h1>
            </header>

            <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{language === 'en' ? 'Interface' : 'Інтерфейс'}</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span>{language === 'en' ? 'App Language' : 'Мова додатку'}</span>
                        <select
                            value={language}
                            onChange={(e) => onLanguageChange(e.target.value)}
                            style={{ padding: '6px 12px', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                        >
                            <option value="en">English</option>
                            <option value="ua">Українська</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{language === 'en' ? 'Theme' : 'Тема'}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={onThemeToggle}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    background: theme === 'light' ? 'var(--accent-primary)' : 'var(--bg-primary)',
                                    color: theme === 'light' ? 'white' : 'var(--text-primary)',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                {language === 'en' ? 'Light' : 'Світла'}
                            </button>
                            <button
                                onClick={onThemeToggle}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    background: theme === 'dark' ? 'var(--accent-primary)' : 'var(--bg-primary)',
                                    color: theme === 'dark' ? 'white' : 'var(--text-primary)',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                {language === 'en' ? 'Dark' : 'Темна'}
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{language === 'en' ? 'Biblical Preferences' : 'Біблійні налаштування'}</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{language === 'en' ? 'Default Translation' : 'Переклад за замовчуванням'}</span>
                        <select
                            value={defaultVersion}
                            style={{ padding: '6px 12px', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                        >
                            <option value="NASB">NASB (English)</option>
                            <option value="UMT">UMT (Ukrainian)</option>
                            <option value="KJV">KJV (English)</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {language === 'en' ? 'BibleStudy' : 'Вивчення Біблії'} v0.1.0-mockup
                </div>
            </section>
        </div>
    );
};

export default Settings;
