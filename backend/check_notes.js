import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const notes = await prisma.note.findMany({
        include: { verse: true, user: true }
    });
    console.log("Verse Notes Found:", notes.length);
    notes.forEach(n => {
        console.log(`[${n.id}] User: ${n.user.email} | Verse: ${n.verseId} | Text: "${n.text}"`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
