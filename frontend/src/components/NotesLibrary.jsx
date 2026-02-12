import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './NotesLibrary.css';
import ConfirmationModal from './ConfirmationModal';

const NotesLibrary = ({ language, notes, userEmail, onNotesUpdate }) => {
    const [selectedNote, setSelectedNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSelectNote = (note) => {
        setSelectedNote(note);
        setIsEditing(false);
    };

    const handleNewNote = () => {
        setSelectedNote({ id: 'new', title: '', content: '' });
        setEditTitle('');
        setEditContent('');
        setIsEditing(true);
    };

    const handleEdit = () => {
        setEditTitle(selectedNote.title);
        setEditContent(selectedNote.content);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (selectedNote.id === 'new') {
            setSelectedNote(null);
        }
    };

    const handleSave = async () => {
        const isNew = selectedNote.id === 'new';
        const endpoint = isNew ? 'http://localhost:5000/api/notes/library' : `http://localhost:5000/api/notes/library/${selectedNote.id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail,
                    title: editTitle,
                    content: editContent
                })
            });

            if (response.ok) {
                const savedNote = await response.json();
                if (isNew) {
                    onNotesUpdate(prev => [savedNote, ...prev]);
                } else {
                    onNotesUpdate(prev => prev.map(n => n.id === savedNote.id ? savedNote : n));
                }
                setSelectedNote(savedNote);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to save note:', error);
            alert('Failed to save note');
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await fetch(`http://localhost:5000/api/notes/library/${selectedNote.id}`, {
                method: 'DELETE'
            });
            onNotesUpdate(prev => prev.filter(n => n.id !== selectedNote.id));
            setSelectedNote(null);
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Failed to delete note:', error);
            alert('Failed to delete note');
        }
    };

    return (
        <div className="notes-library">
            <div className="notes-sidebar">
                <button className="new-note-btn" onClick={handleNewNote}>
                    {language === 'ua' ? '+ Нова Нотатка' : '+ New Note'}
                </button>
                <div className="notes-list">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                            onClick={() => handleSelectNote(note)}
                        >
                            <div className="note-title">{note.title}</div>
                            <div className="note-date">{new Date(note.updatedAt).toLocaleDateString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="note-editor-area">
                {selectedNote ? (
                    isEditing ? (
                        <div className="editor-form">
                            <input
                                type="text"
                                className="title-input"
                                placeholder={language === 'ua' ? 'Заголовок' : 'Title'}
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                            <ReactQuill
                                theme="snow"
                                value={editContent}
                                onChange={setEditContent}
                                placeholder={language === 'ua' ? 'Текст нотатки...' : 'Note content...'}
                                style={{ height: '300px', marginBottom: '50px', flex: 1 }}
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
                            <div className="editor-actions">
                                <button className="save-btn" onClick={handleSave}>
                                    {language === 'ua' ? 'Зберегти' : 'Save'}
                                </button>
                                <button className="cancel-btn" onClick={handleCancel}>
                                    {language === 'ua' ? 'Скасувати' : 'Cancel'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="note-view">
                            <h2>{selectedNote.title}</h2>
                            <div className="note-meta">
                                {new Date(selectedNote.updatedAt).toLocaleString()}
                            </div>
                            <div
                                className="note-content-display"
                                dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                            />
                            <div className="view-actions">
                                <button className="edit-btn" onClick={handleEdit}>
                                    {language === 'ua' ? 'Редагувати' : 'Edit'}
                                </button>
                                <button className="delete-btn" onClick={handleDeleteClick}>
                                    {language === 'ua' ? 'Видалити' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="no-selection">
                        {language === 'ua' ? 'Виберіть нотатку або створіть нову' : 'Select a note or create a new one'}
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                message={language === 'ua' ? 'Ви впевнені, що хочете видалити цю нотатку? Цю дію неможливо скасувати.' : 'Are you sure you want to delete this note? This action cannot be undone.'}
                language={language}
            />
        </div>
    );
};

export default NotesLibrary;
