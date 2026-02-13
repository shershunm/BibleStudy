// Seed functions that can be called from API endpoint
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

export async function seedBible() {
    console.log('Starting Bible seed...');

    // Check if already seeded
    const existingVersions = await prisma.bibleVersion.count();
    if (existingVersions > 0) {
        console.log('Bible versions already exist, skipping...');
        return { message: 'Bible data already seeded' };
    }

    // Read and parse Bible data
    const kjvData = JSON.parse(fs.readFileSync(path.join(__dirname, 'prisma/data/kjv.json'), 'utf-8'));
    const ubioData = JSON.parse(fs.readFileSync(path.join(__dirname, 'prisma/data/ubio.json'), 'utf-8'));
    const kjvStrongsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'prisma/data/kjv-strongs.json'), 'utf-8'));

    // Create Bible versions
    const kjv = await prisma.bibleVersion.create({
        data: { code: 'KJV', name: 'King James Version', language: 'en', hasStrongs: false }
    });

    const ubio = await prisma.bibleVersion.create({
        data: { code: 'UBIO', name: 'Ukrainian Bible (Огієнко)', language: 'uk', hasStrongs: false }
    });

    const kjvStrongs = await prisma.bibleVersion.create({
        data: { code: 'KJV_STRONGS', name: 'KJV with Strong\'s Numbers', language: 'en', hasStrongs: true }
    });

    console.log('Bible versions created');

    // Seed verses (simplified - you may need to adjust based on your data structure)
    let verseCount = 0;
    for (const book of kjvData.books || []) {
        for (const chapter of book.chapters || []) {
            for (const verse of chapter.verses || []) {
                await prisma.verse.create({
                    data: {
                        versionId: kjv.id,
                        book: book.name,
                        chapter: chapter.number,
                        verse: verse.number,
                        text: verse.text
                    }
                });
                verseCount++;
            }
        }
    }

    console.log(`Seeded ${verseCount} verses`);
    return { message: `Bible data seeded successfully: ${verseCount} verses` };
}

export async function seedStrongs() {
    console.log('Starting Strong\'s seed...');

    const existingEntries = await prisma.strongsEntry.count();
    if (existingEntries > 0) {
        console.log('Strong\'s entries already exist, skipping...');
        return { message: 'Strong\'s data already seeded' };
    }

    // Read Strong's data
    const hebrewData = JSON.parse(fs.readFileSync(path.join(__dirname, 'prisma/data/strongs-hebrew.json'), 'utf-8'));
    const greekData = JSON.parse(fs.readFileSync(path.join(__dirname, 'prisma/data/strongs-greek.json'), 'utf-8'));

    let count = 0;

    // Seed Hebrew entries
    for (const [number, entry] of Object.entries(hebrewData)) {
        await prisma.strongsEntry.create({
            data: {
                number: number,
                language: 'hebrew',
                transliteration: entry.transliteration || '',
                pronunciation: entry.pronunciation || '',
                definition: entry.definition || '',
                definitionUkrainian: entry.definitionUkrainian || ''
            }
        });
        count++;
    }

    // Seed Greek entries
    for (const [number, entry] of Object.entries(greekData)) {
        await prisma.strongsEntry.create({
            data: {
                number: number,
                language: 'greek',
                transliteration: entry.transliteration || '',
                pronunciation: entry.pronunciation || '',
                definition: entry.definition || '',
                definitionUkrainian: entry.definitionUkrainian || ''
            }
        });
        count++;
    }

    console.log(`Seeded ${count} Strong's entries`);
    return { message: `Strong's data seeded successfully: ${count} entries` };
}

export async function seedMaps() {
    console.log('Starting map data seed...');

    const existingLocations = await prisma.mapLocation.count();
    if (existingLocations > 0) {
        console.log('Map locations already exist, skipping...');
        return { message: 'Map data already seeded' };
    }

    const mapData = JSON.parse(fs.readFileSync(path.join(__dirname, 'prisma/data/map-locations.json'), 'utf-8'));

    let locationCount = 0;
    for (const location of mapData.locations || []) {
        await prisma.mapLocation.create({
            data: {
                name: location.name,
                nameUkrainian: location.nameUkrainian,
                latitude: location.latitude,
                longitude: location.longitude,
                type: location.type,
                description: location.description,
                descriptionUkrainian: location.descriptionUkrainian,
                biblicalReferences: location.biblicalReferences
            }
        });
        locationCount++;
    }

    let journeyCount = 0;
    for (const journey of mapData.journeys || []) {
        await prisma.journey.create({
            data: {
                name: journey.name,
                nameUkrainian: journey.nameUkrainian,
                description: journey.description,
                descriptionUkrainian: journey.descriptionUkrainian,
                path: journey.path,
                color: journey.color
            }
        });
        journeyCount++;
    }

    console.log(`Seeded ${locationCount} locations and ${journeyCount} journeys`);
    return { message: `Map data seeded successfully: ${locationCount} locations, ${journeyCount} journeys` };
}
