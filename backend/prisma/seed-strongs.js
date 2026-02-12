import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function seedStrongs() {
    console.log('Seeding Strong\'s Dictionary...');

    // Read Greek dictionary
    const greekPath = path.join(__dirname, '../bible_data/ukrainian/strongs-greek-dictionary.js');
    const greekContent = fs.readFileSync(greekPath, 'utf-8');

    // Extract JSON from JavaScript file (it's in format: var strongsGreek = {...})
    const greekMatch = greekContent.match(/var\s+\w+\s*=\s*({[\s\S]*});/);
    if (!greekMatch) {
        console.error('Could not parse Greek dictionary');
        return;
    }
    const greekData = JSON.parse(greekMatch[1]);

    // Read Hebrew dictionary
    const hebrewPath = path.join(__dirname, '../bible_data/ukrainian/strongs-hebrew-dictionary.js');
    const hebrewContent = fs.readFileSync(hebrewPath, 'utf-8');

    const hebrewMatch = hebrewContent.match(/var\s+\w+\s*=\s*({[\s\S]*});/);
    if (!hebrewMatch) {
        console.error('Could not parse Hebrew dictionary');
        return;
    }
    const hebrewData = JSON.parse(hebrewMatch[1]);

    console.log(`Found ${Object.keys(greekData).length} Greek entries`);
    console.log(`Found ${Object.keys(hebrewData).length} Hebrew entries`);

    // Insert Greek entries
    let greekCount = 0;
    for (const [strongsNum, entry] of Object.entries(greekData)) {
        try {
            await prisma.strongsEntry.create({
                data: {
                    strongsNumber: strongsNum,
                    language: 'greek',
                    translit: entry.translit || '',
                    lemma: entry.lemma || '',
                    kjvDef: entry.kjv_def || null,
                    strongsDef: entry.strongs_def || null,
                    derivation: entry.derivation || null,
                    ukrainianDef: null // Will be added later via translation
                }
            });
            greekCount++;
            if (greekCount % 100 === 0) {
                console.log(`  Inserted ${greekCount} Greek entries...`);
            }
        } catch (error) {
            console.error(`Error inserting ${strongsNum}:`, error.message);
        }
    }

    // Insert Hebrew entries
    let hebrewCount = 0;
    for (const [strongsNum, entry] of Object.entries(hebrewData)) {
        try {
            await prisma.strongsEntry.create({
                data: {
                    strongsNumber: strongsNum,
                    language: 'hebrew',
                    translit: entry.translit || '',
                    lemma: entry.lemma || '',
                    kjvDef: entry.kjv_def || null,
                    strongsDef: entry.strongs_def || null,
                    derivation: entry.derivation || null,
                    ukrainianDef: null // Will be added later via translation
                }
            });
            hebrewCount++;
            if (hebrewCount % 100 === 0) {
                console.log(`  Inserted ${hebrewCount} Hebrew entries...`);
            }
        } catch (error) {
            console.error(`Error inserting ${strongsNum}:`, error.message);
        }
    }

    console.log(`✓ Seeded ${greekCount} Greek and ${hebrewCount} Hebrew Strong's entries`);
}

async function main() {
    try {
        await seedStrongs();
    } catch (error) {
        console.error('Error seeding Strong\'s dictionary:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
