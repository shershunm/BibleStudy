import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function addStrongsToVerses() {
    console.log('Adding Strong\'s numbers to sample Ukrainian verses...');

    // Genesis 1:1 - "In the beginning God created the heaven and the earth"
    // Hebrew Strong's: H7225 (beginning), H430 (God), H1254 (created), H8064 (heaven), H853 (and), H776 (earth)
    const gen1_1 = await prisma.verse.findFirst({
        where: {
            number: 1,
            chapter: {
                number: 1,
                book: {
                    number: 1,
                    bibleVersion: {
                        code: 'UBIO'
                    }
                }
            }
        }
    });

    if (gen1_1) {
        await prisma.verse.update({
            where: { id: gen1_1.id },
            data: { strongsNumbers: 'H7225,H430,H1254,H8064,H853,H776' }
        });
        console.log('✓ Updated Genesis 1:1 with Strong\'s numbers');
    }

    // Genesis 1:2 - "And the earth was without form, and void..."
    // H776 (earth), H1961 (was), H8414 (without form), H922 (void), H2822 (darkness), H6440 (face), H8415 (deep), H7307 (Spirit), H430 (God), H7363 (moved), H5921 (upon), H6440 (face), H4325 (waters)
    const gen1_2 = await prisma.verse.findFirst({
        where: {
            number: 2,
            chapter: {
                number: 1,
                book: {
                    number: 1,
                    bibleVersion: {
                        code: 'UBIO'
                    }
                }
            }
        }
    });

    if (gen1_2) {
        await prisma.verse.update({
            where: { id: gen1_2.id },
            data: { strongsNumbers: 'H776,H1961,H8414,H922,H2822,H6440,H8415,H7307,H430,H7363,H5921,H6440,H4325' }
        });
        console.log('✓ Updated Genesis 1:2 with Strong\'s numbers');
    }

    // Genesis 1:3 - "And God said, Let there be light: and there was light"
    // H430 (God), H559 (said), H1961 (be), H216 (light), H1961 (was), H216 (light)
    const gen1_3 = await prisma.verse.findFirst({
        where: {
            number: 3,
            chapter: {
                number: 1,
                book: {
                    number: 1,
                    bibleVersion: {
                        code: 'UBIO'
                    }
                }
            }
        }
    });

    if (gen1_3) {
        await prisma.verse.update({
            where: { id: gen1_3.id },
            data: { strongsNumbers: 'H430,H559,H1961,H216,H1961,H216' }
        });
        console.log('✓ Updated Genesis 1:3 with Strong\'s numbers');
    }

    // Also add to other Ukrainian versions for testing
    const versions = ['UKRK', 'TURK'];
    for (const versionCode of versions) {
        const verse1 = await prisma.verse.findFirst({
            where: {
                number: 1,
                chapter: {
                    number: 1,
                    book: {
                        number: 1,
                        bibleVersion: { code: versionCode }
                    }
                }
            }
        });

        if (verse1) {
            await prisma.verse.update({
                where: { id: verse1.id },
                data: { strongsNumbers: 'H7225,H430,H1254,H8064,H853,H776' }
            });
            console.log(`✓ Updated ${versionCode} Genesis 1:1 with Strong's numbers`);
        }
    }

    console.log('\n✅ Successfully added Strong\'s numbers to sample verses!');
}

async function main() {
    try {
        await addStrongsToVerses();
    } catch (error) {
        console.error('Error adding Strong\'s numbers:', error);
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
