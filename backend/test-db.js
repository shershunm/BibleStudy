import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
    console.log('Testing Prisma connection...');
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'shershunm@example.com' }
        });
        console.log('Connection successful!');
        console.log('User found:', user ? user.email : 'No user found');

        if (user && user.password === '12345') {
            console.log('Password match: SUCCESS');
        } else {
            console.log('Password match: FAIL');
        }
    } catch (error) {
        console.error('CONNECTION FAILED:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
