import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.note.deleteMany({
        where: { text: 'UniqueSearchableVerseNote' }
    });
    await prisma.studyNote.deleteMany({
        where: { title: 'Unique Study Note' }
    });
    console.log("Cleaned up test notes.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
