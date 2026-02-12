import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create Test User
    const testUser = await prisma.user.upsert({
        where: { email: 'shershunm@example.com' },
        update: {},
        create: {
            email: 'shershunm@example.com',
            password: '12345',
            name: 'Mykhailo',
        },
    });
    console.log(`Created user: ${testUser.name}`);

    // 2. Create Bible Versions
    const versions = [
        { code: 'UBIO', name: 'Огієнка (1962)', language: 'ua' },
        { code: 'UKRK', name: 'Куліша (1903)', language: 'ua' },
        { code: 'TURK', name: 'Турконяка (2011)', language: 'ua' },
        { code: 'ERV-UK', name: 'Easy-To-Read (UMT)', language: 'ua' },
        { code: 'KJV', name: 'King James Version', language: 'en' },
        { code: 'ASV', name: 'American Standard Version', language: 'en' },
        { code: 'WEB', name: 'World English Bible', language: 'en' },
        { code: 'BSB', name: 'Berean Study Bible', language: 'en' },
        { code: 'KJV-STR', name: 'KJV with Strong\'s', language: 'en' },
    ];

    for (const v of versions) {
        // Find or create version
        const version = await prisma.bibleVersion.upsert({
            where: { code: v.code },
            update: { name: v.name, language: v.language },
            create: {
                code: v.code,
                name: v.name,
                language: v.language,
            },
        });
        console.log(`Ensured Bible Version: ${version.name}`);

        // Create Sample Book: Genesis / Буття
        const genesisName = v.language === 'ua' ? 'Буття' : 'Genesis';
        const genesis = await prisma.book.upsert({
            where: {
                bibleVersionId_number: {
                    bibleVersionId: version.id,
                    number: 1,
                },
            },
            update: {},
            create: {
                number: 1,
                name: genesisName,
                bibleVersionId: version.id,
            },
        });

        // Create Sample Chapter 1 (Genesis)
        const gen1 = await prisma.chapter.upsert({
            where: {
                bookId_number: {
                    bookId: genesis.id,
                    number: 1,
                },
            },
            update: {},
            create: {
                number: 1,
                bookId: genesis.id,
            },
        });

        // Create Sample Chapter 2 (Genesis)
        const gen2 = await prisma.chapter.upsert({
            where: {
                bookId_number: {
                    bookId: genesis.id,
                    number: 2,
                },
            },
            update: {},
            create: {
                number: 2,
                bookId: genesis.id,
            },
        });

        // Create Sample Book: Exodus / Вихід
        const exodusName = v.language === 'ua' ? 'Вихід' : 'Exodus';
        const exodus = await prisma.book.upsert({
            where: {
                bibleVersionId_number: {
                    bibleVersionId: version.id,
                    number: 2,
                },
            },
            update: {},
            create: {
                number: 2,
                name: exodusName,
                bibleVersionId: version.id,
            },
        });

        // Create Sample Chapter 1 (Exodus)
        const ex1 = await prisma.chapter.upsert({
            where: {
                bookId_number: {
                    bookId: exodus.id,
                    number: 1,
                },
            },
            update: {},
            create: {
                number: 1,
                bookId: exodus.id,
            },
        });

        // Seeding Genesis 1 Verses
        let gen1Verses = v.language === 'ua' ? [
            { number: 1, text: 'На початку Бог створив Небо та землю.' },
            { number: 2, text: 'А земля була пуста та порожня, і темрява була над безоднею, і Дух Божий ширяв над поверхнею води.' },
            { number: 3, text: 'І сказав Бог: Хай станеться світло! І сталося світло.' },
            { number: 4, text: 'І побачив Бог світло, що добре воно, і Бог відділив світло від темряви.' },
            { number: 5, text: 'І Бог назвав світло: День, а темряву назвав: Ніч. І був вечір, і був ранок, день перший.' },
        ] : [
            { number: 1, text: 'In the beginning God created the heaven and the earth.' },
            { number: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
            { number: 3, text: 'And God said, Let there be light: and there was light.' },
            { number: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
            { number: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' },
        ];

        // Specific tagged text for KJV-STR
        if (v.code === 'KJV-STR') {
            gen1Verses = [
                { number: 1, text: 'In <H7225> the beginning <H7225> God <H430> created <H1254> the heaven <H8064> and the earth <H776>.' },
                { number: 2, text: 'And the earth <H776> was without form <H8414>, and void <H922>; and darkness <H2822> was upon the face <H6440> of the deep <H8415>.' },
                { number: 3, text: 'And God <H430> said <H559>, Let there be light <H216>: and there was light <H216>.' },
                { number: 4, text: 'And God <H430> saw <H7200> the light <H216>, that it was good <H2896>: and God <H430> divided <H914> the light <H216> from the darkness <H2822>.' },
                { number: 5, text: 'And God <H430> called <H7121> the light <H216> Day <H3117>, and the darkness <H2822> he called <H7121> Night <H3915>.' },
            ];
        }

        const seedVerses = async (chapterId, verses) => {
            for (const sv of verses) {
                await prisma.verse.upsert({
                    where: {
                        chapterId_number: {
                            chapterId: chapterId,
                            number: sv.number,
                        },
                    },
                    update: { text: sv.text },
                    create: {
                        number: sv.number,
                        text: sv.text,
                        chapterId: chapterId,
                    },
                });
            }
        };

        await seedVerses(gen1.id, gen1Verses);

        // Seeding Genesis 2 Verses (Sample)
        const gen2Verses = v.language === 'ua' ? [
            { number: 1, text: 'І були скінчені небо й земля і все воїнство їх.' },
        ] : [
            { number: 1, text: 'Thus the heavens and the earth were finished, and all the host of them.' },
        ];
        await seedVerses(gen2.id, gen2Verses);

        // Seeding Exodus 1 Verses (Sample)
        const ex1Verses = v.language === 'ua' ? [
            { number: 1, text: 'А оце ймення синів Ізраїлевих, що прийшли до Єгипту з Яковом...' },
        ] : [
            { number: 1, text: 'Now these are the names of the children of Israel, which came into Egypt...' },
        ];
        await seedVerses(ex1.id, ex1Verses);

        console.log(`Seeded Gen 1, Gen 2, Exod 1 for ${v.code}`);
    }

    // 3. Seed Sample Dictionary Data
    const dictionaryEntries = [
        {
            code: 'H7225',
            headword: 'רֵאשִׁית',
            transliteration: 'resheet',
            definition: 'first, beginning, best, chief',
            pronunciation: 'ray-sheeth\'',
            strongsNumber: '7225'
        },
        {
            code: 'G746',
            headword: 'ἀρχή',
            transliteration: 'archē',
            definition: 'beginning, origin, first, ruler',
            pronunciation: 'ar-khay\'',
            strongsNumber: '746'
        }
    ];

    for (const entry of dictionaryEntries) {
        await prisma.dictionaryEntry.upsert({
            where: { code: entry.code },
            update: entry,
            create: entry,
        });
    }
    console.log('Seeded sample dictionary entries.');

    // 4. Seed Sample Map Locations
    const locations = [
        {
            name: 'Jerusalem',
            latitude: 31.7683,
            longitude: 35.2137,
            description: 'The capital City of Israel, central to biblical history.',
            biblicalEra: 'United Monarchy, Early Church'
        },
        {
            name: 'Hebron',
            latitude: 31.5298,
            longitude: 35.1021,
            description: 'Ancient city, home of the Patriarchs.',
            biblicalEra: 'Patriarchal'
        }
    ];

    for (const loc of locations) {
        await prisma.mapLocation.upsert({
            where: { id: locations.indexOf(loc) + 1 }, // Simple ID for seeding
            update: loc,
            create: loc,
        });
    }
    console.log('Seeded sample map locations.');

    console.log('Seeding completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
