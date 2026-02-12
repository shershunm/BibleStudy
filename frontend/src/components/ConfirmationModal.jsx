import React from 'react';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel, language }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--border-color)'
            }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>
                    {language === 'ua' ? 'Підтвердження' : 'Confirm Action'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    {message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            cursor: 'pointer'
                        }}
                    >
                        {language === 'ua' ? 'Скасувати' : 'Cancel'}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#ff4d4d',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        {language === 'ua' ? 'Видалити' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
