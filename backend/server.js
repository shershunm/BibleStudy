import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    console.log(`Login attempt: ${email}`);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { notes: true }
        });

        if (user && user.password === password) {
            // Return success and a mock token
            res.json({
                success: true,
                user: {
                    email: user.email,
                    name: user.name
                },
                token: 'mock-jwt-token-for-testing',
                studyPad: user.studyPad,
                notes: user.notes
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Registration Endpoint
app.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body;
    console.log(`Registering user: ${email}`);

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password, // In production, hash this!
                name,
                studyPad: ''
            }
        });

        res.json({
            success: true,
            user: {
                email: newUser.email,
                name: newUser.name
            },
            token: 'mock-jwt-token-for-testing',
            studyPad: newUser.studyPad,
            notes: []
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
});

// Update Study Pad
app.post('/api/user/studypad', async (req, res) => {
    const { email, content } = req.body;
    console.log(`Updating studypad for: ${email}`);
    try {
        await prisma.user.update({
            where: { email },
            data: { studyPad: content }
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Failed to update study pad:', error);
        res.status(500).json({ error: 'Failed to update study pad' });
    }
});

// Notes API
app.get('/api/notes', async (req, res) => {
    // In a real app, get userId from token. Here we rely on query param or just fail safely
    const { email } = req.query; // Simple auth-less demo approach
    if (!email) return res.json([]);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { notes: true }
        });
        res.json(user ? user.notes : []);
    } catch (error) {
        console.error('Failed to fetch notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

app.post('/api/notes', async (req, res) => {
    const { email, verseId, text } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Update or create note
        // Check if note exists
        const existingNote = await prisma.note.findFirst({
            where: { userId: user.id, verseId: verseId }
        });

        if (existingNote) {
            await prisma.note.update({
                where: { id: existingNote.id },
                data: { text }
            });
        } else {
            await prisma.note.create({
                data: {
                    userId: user.id,
                    verseId: verseId,
                    text
                }
            });
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save note' });
    }
});

// Bible Content Endpoints
app.get('/api/bible/versions', async (req, res) => {
    try {
        const versions = await prisma.bibleVersion.findMany();
        res.json(versions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch versions' });
    }
});

app.get('/api/bible/books/:versionCode', async (req, res) => {
    const { versionCode } = req.params;
    try {
        const version = await prisma.bibleVersion.findUnique({
            where: { code: versionCode },
            include: {
                books: {
                    include: {
                        chapters: {
                            select: { number: true },
                            orderBy: { number: 'asc' }
                        }
                    }
                }
            }
        });
        if (!version) return res.status(404).json({ error: 'Version not found' });
        res.json(version.books);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

app.get('/api/bible/chapter/:versionCode/:bookNumber/:chapterNumber', async (req, res) => {
    const { versionCode, bookNumber, chapterNumber } = req.params;
    try {
        const version = await prisma.bibleVersion.findUnique({
            where: { code: versionCode }
        });
        if (!version) return res.status(404).json({ error: 'Version not found' });

        const book = await prisma.book.findFirst({
            where: { bibleVersionId: version.id, number: parseInt(bookNumber) }
        });
        if (!book) return res.status(404).json({ error: 'Book not found' });

        const chapter = await prisma.chapter.findFirst({
            where: { bookId: book.id, number: parseInt(chapterNumber) },
            include: { verses: { orderBy: { number: 'asc' } } }
        });
        if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

        res.json({
            bookName: book.name,
            chapterNumber: chapter.number,
            verses: chapter.verses
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chapter' });
    }
});


// Strong's Dictionary API
app.get('/api/strongs/:number', async (req, res) => {
    const { number } = req.params;
    try {
        const entry = await prisma.strongsEntry.findUnique({
            where: { strongsNumber: number.toUpperCase() }
        });
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.json(entry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Strong\'s entry' });
    }
});

// Legacy dictionary API (for backward compatibility with existing dictionary entries)
app.get('/api/dictionary/:code', async (req, res) => {
    const { code } = req.params;
    // Check if it's a Strong's number
    if (code.match(/^[HG]\d+$/i)) {
        try {
            const entry = await prisma.strongsEntry.findUnique({
                where: { strongsNumber: code.toUpperCase() }
            });
            if (!entry) return res.status(404).json({ error: 'Entry not found' });
            res.json({
                code: entry.strongsNumber,
                headword: entry.lemma,
                transliteration: entry.translit,
                definition: entry.ukrainianDef || entry.strongsDef || entry.kjvDef || '',
                pronunciation: entry.translit
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch dictionary entry' });
        }
    } else {
        res.status(404).json({ error: 'Entry not found' });
    }
});


// User Sync Endpoint - Fixes persistence issues by fetching all data
app.get('/api/user/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                notes: true,
                studyNotes: { orderBy: { updatedAt: 'desc' } }
            }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            user: { email: user.email, name: user.name },
            studyPad: user.studyPad,
            notes: user.notes,
            studyNotes: user.studyNotes
        });
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ error: 'Failed to sync user data' });
    }
});

// Study Notes Library API
app.get('/api/notes/library', async (req, res) => {
    const { email } = req.query;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { studyNotes: { orderBy: { updatedAt: 'desc' } } }
        });
        res.json(user ? user.studyNotes : []);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch library notes' });
    }
});

app.post('/api/notes/library', async (req, res) => {
    const { email, title, content } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const note = await prisma.studyNote.create({
            data: {
                userId: user.id,
                title,
                content
            }
        });
        res.json(note);
    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
});

app.put('/api/notes/library/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const note = await prisma.studyNote.update({
            where: { id: parseInt(id) },
            data: { title, content }
        });
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update note' });
    }
});

app.delete('/api/notes/library/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.studyNote.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

// Maps API
app.get('/api/maps/locations', async (req, res) => {
    try {
        const locations = await prisma.mapLocation.findMany();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch map locations' });
    }
});

// Search API
app.get('/api/search', async (req, res) => {
    const { q, scope, email } = req.query;

    if (!q || q.length < 2) {
        return res.json({ results: [] });
    }

    try {
        const results = {
            bible: [],
            dictionary: [],
            maps: [],
            notes: []
        };

        const searchAll = !scope || scope === 'all';

        // 1. Search Bible Verses
        if (searchAll || scope === 'bible') {
            const verses = await prisma.verse.findMany({
                where: {
                    text: { contains: q }
                },
                take: 10,
                include: {
                    chapter: {
                        include: {
                            book: {
                                include: {
                                    bibleVersion: true
                                }
                            }
                        }
                    }
                }
            });
            results.bible = verses.map(v => ({
                type: 'verse',
                id: v.id,
                text: v.text,
                reference: `${v.chapter.book.name} ${v.chapter.number}:${v.number}`,
                version: v.chapter.book.bibleVersion.code,
                bookNumber: v.chapter.book.number,
                chapterNumber: v.chapter.number,
                verseNumber: v.number
            }));
        }

        // 2. Search Dictionary
        if (searchAll || scope === 'dictionary') {
            const entries = await prisma.dictionaryEntry.findMany({
                where: {
                    OR: [
                        { headword: { contains: q } },
                        { definition: { contains: q } },
                        { transliteration: { contains: q } }
                    ]
                },
                take: 5
            });
            results.dictionary = entries.map(e => ({
                type: 'dictionary',
                id: e.id,
                code: e.code,
                headword: e.headword,
                definition: e.definition.substring(0, 100) + '...'
            }));
        }

        // 3. Search Map Locations
        if (searchAll || scope === 'maps') {
            const locations = await prisma.mapLocation.findMany({
                where: {
                    OR: [
                        { name: { contains: q } },
                        { description: { contains: q } }
                    ]
                },
                take: 5
            });
            results.maps = locations.map(l => ({
                type: 'map',
                id: l.id,
                name: l.name,
                description: l.description
            }));
        }

        // 4. Search User Notes (Verse Notes & Study Notes)
        if ((searchAll || scope === 'notes') && email) {
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (user) {
                // Verse Notes
                const verseNotes = await prisma.note.findMany({
                    where: {
                        userId: user.id,
                        text: { contains: q }
                    },
                    take: 5,
                    include: {
                        verse: {
                            include: {
                                chapter: {
                                    include: {
                                        book: true
                                    }
                                }
                            }
                        }
                    }
                });

                // Study Notes (Library)
                const studyNotes = await prisma.studyNote.findMany({
                    where: {
                        userId: user.id,
                        OR: [
                            { title: { contains: q } },
                            { content: { contains: q } }
                        ]
                    },
                    take: 5
                });

                results.notes = [
                    ...verseNotes.map(n => ({
                        type: 'verse_note',
                        id: n.id,
                        text: n.text,
                        reference: `${n.verse.chapter.book.name} ${n.verse.chapter.number}:${n.verse.number}`,
                        bookNumber: n.verse.chapter.book.number,
                        chapterNumber: n.verse.chapter.number,
                        verseNumber: n.verse.number,
                        preview: n.text
                    })),
                    ...studyNotes.map(sn => ({
                        type: 'study_note',
                        id: sn.id,
                        title: sn.title,
                        preview: sn.content.replace(/<[^>]*>?/gm, '').substring(0, 50) + '...' // Strip HTML for preview
                    }))
                ];
            }
        }

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});

