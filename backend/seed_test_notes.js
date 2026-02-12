import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({ where: { email: 'shershunm@example.com' } });
    if (!user) throw new Error("User not found");

    // Create or update note for Genesis 1:1 (verseId: 1)
    const note = await prisma.note.upsert({
        where: {
            id: 1 // Assuming id 1 if it exists, or let's better query by user/verse
        },
        update: {
            text: 'UniqueSearchableVerseNote'
        },
        create: {
            userId: user.id,
            verseId: 1, // Genesis 1:1
            text: 'UniqueSearchableVerseNote'
        }
    });

    // Also create a Study Note
    await prisma.studyNote.create({
        data: {
            userId: user.id,
            title: 'Unique Study Note',
            content: 'Content for unique study note search.'
        }
    });

    console.log("Created/Updated test notes.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
