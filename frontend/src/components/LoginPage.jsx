import React, { useState, useEffect } from 'react';

const LoginPage = ({ onLogin, language, theme }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Clear fields on toggle
    useEffect(() => {
        setEmail('');
        setPassword('');
        setName('');
        setError('');
    }, [isRegistering]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isRegistering ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/login';
        const body = isRegistering ? { email, password, name } : { email, password };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.success) {
                // Pass extra data (notes, studyPad) if available
                onLogin(data.user, data.token, data.studyPad, data.notes);
            } else {
                setError(data.message || 'Authentication failed');
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
                    {isRegistering && (
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {language === 'en' ? 'Full Name' : 'Повне ім\'я'}
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="name"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-tertiary)',
                                    color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                                placeholder={language === 'en' ? "John Doe" : "Іван Петренко"}
                            />
                        </div>
                    )}

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
                        {loading ? (language === 'en' ? 'Processing...' : 'Обробка...') :
                            (isRegistering ? (language === 'en' ? 'Register' : 'Зареєструватися') : (language === 'en' ? 'Sign In' : 'Увійти'))
                        }
                    </button>
                </form>

                <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {isRegistering ?
                        (language === 'en' ? "Already have an account? " : 'Вже маєте акаунту? ') :
                        (language === 'en' ? "Don't have an account? " : 'Немає акаунту? ')
                    }
                    <span
                        style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => setIsRegistering(!isRegistering)}
                    >
                        {isRegistering ?
                            (language === 'en' ? 'Sign In' : 'Увійти') :
                            (language === 'en' ? 'Sign Up' : 'Зареєструватися')
                        }
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
