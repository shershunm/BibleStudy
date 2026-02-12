import React, { useState, useEffect } from 'react';

const LoginPage = ({ onLogin, language, theme }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const logoSrc = theme === 'dark' ? '/BibleStudyLogo_darkMode.png' : '/BibleStudyLogo_lightMode.png';

    // Clear fields on mount to prevent auto-fill duplication issues
    useEffect(() => {
        const timer = setTimeout(() => {
            setEmail('');
            setPassword('');
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                onLogin(data.user);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Could not connect to the server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-serif)'
        }}>
            <div className="login-card" style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '2.5rem',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                        <span style={{ color: theme === 'light' ? 'black' : 'white' }}>
                            {language === 'en' ? 'Foundational' : 'Фундаментальне'}
                        </span>{' '}
                        <span style={{ color: 'var(--accent-primary)' }}>
                            {language === 'en' ? 'Bible Study' : 'Вивчення Біблії'}
                        </span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} autoComplete="off">
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {language === 'en' ? 'Email Address' : 'Електронна пошта'}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="off"
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-tertiary)',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                            placeholder="shershunm@example.com"
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {language === 'en' ? 'Password' : 'Пароль'}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '6px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-tertiary)',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                            placeholder="•••••"
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#ff4444', fontSize: '0.85rem', textAlign: 'left' }}>{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '1rem',
                            padding: '0.9rem',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: 'var(--accent-primary)',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? (language === 'en' ? 'Signing in...' : 'Вхід...') : (language === 'en' ? 'Sign In' : 'Увійти')}
                    </button>
                </form>

                <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                    <span style={{ padding: '0 1rem' }}>{language === 'en' ? 'OR' : 'АБО'}</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Google Login Button */}
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '0.8rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'white',
                        color: '#3c4043',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84c-.21 1.12-.84 2.07-1.79 2.7l2.85 2.21c1.67-1.55 2.64-3.82 2.64-6.56z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.85-2.21c-.79.53-1.8.85-3.11.85-2.39 0-4.41-1.61-5.14-3.77L1.01 13.5C2.48 16.17 5.51 18 9 18z" fill="#34A853" />
                            <path d="M3.86 10.69c-.19-.53-.3-1.1-.3-1.69s.11-1.16.3-1.69l-2.85-2.22c-.65 1.29-1.01 2.75-1.01 4.28s.36 2.99 1.01 4.28l2.85-2.22z" fill="#FBBC05" />
                            <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15.02 2.3C13.46.86 11.43 0 9 0 5.51 0 2.48 1.83 1.01 4.5l2.85 2.22c.73-2.16 2.75-3.77 9-3.77z" fill="#EA4335" />
                        </svg>
                        {language === 'en' ? 'Continue with Google' : 'Продовжити з Google'}
                    </button>

                    {/* Apple Login Button */}
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '0.8rem',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#000',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                            <path d="M15.11 12.31c-.55 1.12-1.25 2.13-2.11 3.01-.86.88-1.78 1.48-2.77 1.48-.41 0-.89-.1-1.44-.3-.55-.2-1.05-.3-1.5-.3-.47 0-.98.1-1.53.3-.55.2-1.01.3-1.39.3-1.01 0-1.95-.62-2.83-1.53-.88-.91-1.5-2.07-1.85-3.48-.35-1.41-.35-2.71 0-3.9s.99-2.14 1.93-2.84c.94-.7 1.95-1.05 3.03-1.05.41 0 .89.1 1.44.3.49.18.91.27 1.25.27.24 0 .6-.07 1.1-.2 1.45-.4 2.65-.21 3.59.57-.86.63-1.49 1.49-1.49 2.58s.45 2.02 1.35 2.77zm-4.66-9.13c-.02.43-.16.89-.42 1.39-.26.5-.66.95-1.19 1.35-.45.33-.94.51-1.47.54l-.06-.55c.02-.45.18-.94.47-1.48s.72-1 1.29-1.37c.36-.24.84-.4 1.38-.49z" />
                        </svg>
                        {language === 'en' ? 'Continue with Apple' : 'Продовжити з Apple'}
                    </button>
                </div>

                <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {language === 'en' ? "Don't have an account? " : 'Немає акаунту? '}
                    <span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }}>
                        {language === 'en' ? 'Sign Up' : 'Зареєструватися'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
