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
            where: { email }
        });

        if (user && user.password === password) {
            // Return success and a mock token
            res.json({
                success: true,
                user: {
                    email: user.email,
                    name: user.name
                },
                token: 'mock-jwt-token-for-testing'
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

// Dictionary API
app.get('/api/dictionary/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const entry = await prisma.dictionaryEntry.findUnique({
            where: { code: code.toUpperCase() }
        });
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.json(entry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dictionary entry' });
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

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
