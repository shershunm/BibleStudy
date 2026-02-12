import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Common Ukrainian translations for frequently used Strong's entries
const ukrainianTranslations = {
    // Hebrew - Genesis 1:1-3
    'H7225': 'початок, перший, головний',
    'H430': 'Бог, боги, суддя, могутній',
    'H1254': 'створювати, творити, вибирати',
    'H8064': 'небо, небеса',
    'H853': '(позначення прямого додатка)',
    'H776': 'земля, країна',
    'H1961': 'бути, ставати, траплятися',
    'H8414': 'порожній, марний, пустельний',
    'H922': 'порожній, пустий',
    'H2822': 'темрява, морок',
    'H6440': 'обличчя, присутність, поверхня',
    'H8415': 'безодня, глибина',
    'H7307': 'дух, вітер, подих',
    'H7363': 'рухатися, ширяти',
    'H5921': 'над, на, при',
    'H4325': 'вода, води',
    'H559': 'говорити, сказати',
    'H216': 'світло',

    // Common Greek words
    'G746': 'початок, влада, правління, перший',
    'G2316': 'Бог, божество',
    'G3056': 'слово, промова, розум',
    'G26': 'любов',
    'G4102': 'віра, вірність',
    'G1680': 'надія',
    'G5485': 'благодать, милість',
    'G225': 'істина, правда',
    'G2222': 'життя',
    'G5457': 'світло',
    'G4151': 'дух, Дух',
    'G3772': 'небо, небеса',
    'G1093': 'земля, країна'
};

async function addUkrainianTranslations() {
    console.log('Adding Ukrainian translations to Strong\'s dictionary...');

    let updateCount = 0;

    for (const [strongsNumber, ukrainianDef] of Object.entries(ukrainianTranslations)) {
        try {
            await prisma.strongsEntry.update({
                where: { strongsNumber },
                data: { ukrainianDef }
            });
            updateCount++;
            console.log(`✓ Updated ${strongsNumber}: ${ukrainianDef}`);
        } catch (error) {
            console.error(`✗ Failed to update ${strongsNumber}:`, error.message);
        }
    }

    console.log(`\n✅ Successfully added Ukrainian translations to ${updateCount} entries!`);
    console.log(`\nNote: This is a starter set. You can add more translations by:`);
    console.log(`1. Adding entries to the ukrainianTranslations object above`);
    console.log(`2. Using a translation service API`);
    console.log(`3. Manually translating from the English definitions`);
}

async function main() {
    try {
        await addUkrainianTranslations();
    } catch (error) {
        console.error('Error adding Ukrainian translations:', error);
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
