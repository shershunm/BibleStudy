import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMapData() {
    console.log('Seeding biblical map locations...');

    // Biblical Locations with bilingual names
    const locations = [
        {
            name: 'Jerusalem',
            nameUkrainian: 'Єрусалим',
            description: 'The holy city, capital of ancient Israel and Judah',
            descriptionUa: 'Святе місто, столиця стародавнього Ізраїлю та Юдеї',
            latitude: 31.7683,
            longitude: 35.2137,
            type: 'city',
            biblicalPeriod: 'both',
            verseReferences: '[]'
        },
        {
            name: 'Bethlehem',
            nameUkrainian: 'Віфлеєм',
            description: 'Birthplace of Jesus Christ and King David',
            descriptionUa: 'Місце народження Ісуса Христа та царя Давида',
            latitude: 31.7054,
            longitude: 35.2024,
            type: 'city',
            biblicalPeriod: 'both',
            verseReferences: '[]'
        },
        {
            name: 'Nazareth',
            nameUkrainian: 'Назарет',
            description: 'Hometown of Jesus Christ',
            descriptionUa: 'Рідне місто Ісуса Христа',
            latitude: 32.7009,
            longitude: 35.2988,
            type: 'city',
            biblicalPeriod: 'NT',
            verseReferences: '[]'
        },
        {
            name: 'Sea of Galilee',
            nameUkrainian: 'Галілейське море',
            description: 'Freshwater lake where Jesus performed many miracles',
            descriptionUa: 'Прісноводне озеро, де Ісус здійснив багато чудес',
            latitude: 32.8156,
            longitude: 35.5947,
            type: 'sea',
            biblicalPeriod: 'NT',
            verseReferences: '[]'
        },
        {
            name: 'Dead Sea',
            nameUkrainian: 'Мертве море',
            description: 'Salt lake at the lowest point on Earth',
            descriptionUa: 'Солоне озеро в найнижчій точці Землі',
            latitude: 31.5590,
            longitude: 35.4732,
            type: 'sea',
            biblicalPeriod: 'both',
            verseReferences: '[]'
        },
        {
            name: 'Jordan River',
            nameUkrainian: 'Річка Йордан',
            description: 'River where Jesus was baptized by John the Baptist',
            descriptionUa: 'Річка, де Ісус був охрещений Іоанном Хрестителем',
            latitude: 32.3500,
            longitude: 35.5500,
            type: 'river',
            biblicalPeriod: 'both',
            verseReferences: '[]'
        },
        {
            name: 'Mount Sinai',
            nameUkrainian: 'Гора Синай',
            description: 'Mountain where Moses received the Ten Commandments',
            descriptionUa: 'Гора, де Мойсей отримав Десять Заповідей',
            latitude: 28.5392,
            longitude: 33.9750,
            type: 'mountain',
            biblicalPeriod: 'OT',
            verseReferences: '[]'
        },
        {
            name: 'Damascus',
            nameUkrainian: 'Дамаск',
            description: 'Ancient city where Saul (Paul) was converted',
            descriptionUa: 'Стародавнє місто, де Савл (Павло) навернувся',
            latitude: 33.5138,
            longitude: 36.2765,
            type: 'city',
            biblicalPeriod: 'both',
            verseReferences: '[]'
        },
        {
            name: 'Jericho',
            nameUkrainian: 'Єрихон',
            description: 'Ancient city conquered by Joshua',
            descriptionUa: 'Стародавнє місто, завойоване Ісусом Навином',
            latitude: 31.8558,
            longitude: 35.4614,
            type: 'city',
            biblicalPeriod: 'OT',
            verseReferences: '[]'
        },
        {
            name: 'Capernaum',
            nameUkrainian: 'Капернаум',
            description: 'Fishing village, center of Jesus\' ministry in Galilee',
            descriptionUa: 'Рибальське село, центр служіння Ісуса в Галілеї',
            latitude: 32.8792,
            longitude: 35.5750,
            type: 'city',
            biblicalPeriod: 'NT',
            verseReferences: '[]'
        },
        {
            name: 'Rome',
            nameUkrainian: 'Рим',
            description: 'Capital of the Roman Empire, where Paul was imprisoned',
            descriptionUa: 'Столиця Римської імперії, де Павло був ув\'язнений',
            latitude: 41.9028,
            longitude: 12.4964,
            type: 'city',
            biblicalPeriod: 'NT',
            verseReferences: '[]'
        },
        {
            name: 'Antioch',
            nameUkrainian: 'Антіохія',
            description: 'Early Christian center, where believers were first called Christians',
            descriptionUa: 'Ранній християнський центр, де віруючих вперше назвали християнами',
            latitude: 36.2000,
            longitude: 36.1600,
            type: 'city',
            biblicalPeriod: 'NT',
            verseReferences: '[]'
        },
        {
            name: 'Ephesus',
            nameUkrainian: 'Ефес',
            description: 'Major city where Paul ministered for three years',
            descriptionUa: 'Велике місто, де Павло служив три роки',
            latitude: 37.9495,
            longitude: 27.3639,
            type: 'city',
            biblicalPeriod: 'NT',
            verseReferences: '[]'
        },
        {
            name: 'Corinth',
            nameUkrainian: 'Коринф',
            description: 'Greek city where Paul established a church',
            descriptionUa: 'Грецьке місто, де Павло заснував церкву',
            latitude: 37.9065,
            longitude: 22.8784,
            type: 'city',
            biblicalPeriod: 'NT',
            verseReferences: '[]'
        },
        {
            name: 'Athens',
            nameUkrainian: 'Афіни',
            description: 'Greek city where Paul preached at the Areopagus',
            descriptionUa: 'Грецьке місто, де Павло проповідував в Ареопазі',
            latitude: 37.9838,
            longitude: 23.7275,
            type: 'city',
            biblicalPeriod: 'NT',
            verseReferences: '[]'
        },
        {
            name: 'Babylon',
            nameUkrainian: 'Вавилон',
            description: 'Ancient empire where Israelites were exiled',
            descriptionUa: 'Стародавня імперія, куди ізраїльтяни були вигнані',
            latitude: 32.5355,
            longitude: 44.4275,
            type: 'city',
            biblicalPeriod: 'OT',
            verseReferences: '[]'
        },
        {
            name: 'Egypt',
            nameUkrainian: 'Єгипет',
            description: 'Land where Israelites were enslaved before the Exodus',
            descriptionUa: 'Земля, де ізраїльтяни були поневолені перед Виходом',
            latitude: 26.8206,
            longitude: 30.8025,
            type: 'region',
            biblicalPeriod: 'OT',
            verseReferences: '[]'
        },
        {
            name: 'Mount of Olives',
            nameUkrainian: 'Оливна гора',
            description: 'Mountain east of Jerusalem, site of Jesus\' ascension',
            descriptionUa: 'Гора на схід від Єрусалиму, місце вознесіння Ісуса',
            latitude: 31.7784,
            longitude: 35.2407,
            type: 'mountain',
            biblicalPeriod: 'NT',
            verseReferences: '[]'
        },
        {
            name: 'Golgotha',
            nameUkrainian: 'Голгофа',
            description: 'Place of the Skull, where Jesus was crucified',
            descriptionUa: 'Місце Черепа, де Ісус був розп\'ятий',
            latitude: 31.7784,
            longitude: 35.2296,
            type: 'city',
            biblicalPeriod: 'NT',
            verseReferences: '[]'
        },
        {
            name: 'Tarsus',
            nameUkrainian: 'Тарс',
            description: 'Birthplace of the Apostle Paul',
            descriptionUa: 'Місце народження апостола Павла',
            latitude: 36.9177,
            longitude: 34.8956,
            type: 'city',
            biblicalPeriod: 'NT',
            verseReferences: '[]'
        }
    ];

    for (const location of locations) {
        await prisma.mapLocation.upsert({
            where: { id: locations.indexOf(location) + 1 },
            update: location,
            create: location
        });
    }

    console.log(`✓ Seeded ${locations.length} biblical locations`);

    // Journey Routes
    console.log('Seeding journey routes...');

    const journeys = [
        {
            name: "Paul's First Missionary Journey",
            nameUkrainian: 'Перша місіонерська подорож Павла',
            description: 'Journey through Cyprus and southern Galatia (Acts 13-14)',
            descriptionUa: 'Подорож через Кіпр та південну Галатію (Дії 13-14)',
            category: 'paul_missionary_1',
            color: '#0033FF',
            waypoints: JSON.stringify([
                { lat: 36.2000, lng: 36.1600, name: 'Antioch' },
                { lat: 36.1384, lng: 33.9213, name: 'Seleucia' },
                { lat: 35.1264, lng: 33.4299, name: 'Salamis' },
                { lat: 34.9175, lng: 33.6240, name: 'Paphos' },
                { lat: 36.5667, lng: 31.8667, name: 'Perga' },
                { lat: 38.3687, lng: 31.1856, name: 'Antioch of Pisidia' },
                { lat: 37.8746, lng: 32.4932, name: 'Iconium' },
                { lat: 37.6167, lng: 33.2167, name: 'Lystra' },
                { lat: 37.8667, lng: 33.7167, name: 'Derbe' },
                { lat: 36.2000, lng: 36.1600, name: 'Antioch (return)' }
            ])
        },
        {
            name: "Paul's Second Missionary Journey",
            nameUkrainian: 'Друга місіонерська подорож Павла',
            description: 'Journey through Asia Minor and Greece (Acts 15:36-18:22)',
            descriptionUa: 'Подорож через Малу Азію та Грецію (Дії 15:36-18:22)',
            category: 'paul_missionary_2',
            color: '#0033FF',
            waypoints: JSON.stringify([
                { lat: 36.2000, lng: 36.1600, name: 'Antioch' },
                { lat: 37.8746, lng: 32.4932, name: 'Iconium' },
                { lat: 37.6167, lng: 33.2167, name: 'Lystra' },
                { lat: 39.9334, lng: 32.8597, name: 'Ankara region' },
                { lat: 39.6484, lng: 27.8826, name: 'Troas' },
                { lat: 40.9389, lng: 24.4081, name: 'Philippi' },
                { lat: 40.6401, lng: 22.9444, name: 'Thessalonica' },
                { lat: 40.5138, lng: 22.9444, name: 'Berea' },
                { lat: 37.9838, lng: 23.7275, name: 'Athens' },
                { lat: 37.9065, lng: 22.8784, name: 'Corinth' },
                { lat: 37.9495, lng: 27.3639, name: 'Ephesus' },
                { lat: 31.7683, lng: 35.2137, name: 'Jerusalem' },
                { lat: 36.2000, lng: 36.1600, name: 'Antioch (return)' }
            ])
        },
        {
            name: "Paul's Third Missionary Journey",
            nameUkrainian: 'Третя місіонерська подорож Павла',
            description: 'Extended ministry in Ephesus and Greece (Acts 18:23-21:17)',
            descriptionUa: 'Розширене служіння в Ефесі та Греції (Дії 18:23-21:17)',
            category: 'paul_missionary_3',
            color: '#0033FF',
            waypoints: JSON.stringify([
                { lat: 36.2000, lng: 36.1600, name: 'Antioch' },
                { lat: 38.3687, lng: 31.1856, name: 'Galatia' },
                { lat: 37.9495, lng: 27.3639, name: 'Ephesus' },
                { lat: 37.9065, lng: 22.8784, name: 'Corinth' },
                { lat: 40.9389, lng: 24.4081, name: 'Philippi' },
                { lat: 39.6484, lng: 27.8826, name: 'Troas' },
                { lat: 38.4192, lng: 27.1287, name: 'Miletus' },
                { lat: 36.4011, lng: 28.3838, name: 'Rhodes' },
                { lat: 32.8872, lng: 34.8872, name: 'Caesarea' },
                { lat: 31.7683, lng: 35.2137, name: 'Jerusalem' }
            ])
        },
        {
            name: "The Exodus Route",
            nameUkrainian: 'Маршрут Виходу',
            description: 'Journey of Israelites from Egypt to Canaan',
            descriptionUa: 'Подорож ізраїльтян з Єгипту до Ханаану',
            category: 'exodus',
            color: '#FF6B00',
            waypoints: JSON.stringify([
                { lat: 30.0444, lng: 31.2357, name: 'Rameses (Egypt)' },
                { lat: 30.5852, lng: 32.2654, name: 'Succoth' },
                { lat: 29.9668, lng: 32.5498, name: 'Red Sea Crossing' },
                { lat: 29.3759, lng: 32.8597, name: 'Marah' },
                { lat: 28.5392, lng: 33.9750, name: 'Mount Sinai' },
                { lat: 30.3285, lng: 35.4444, name: 'Kadesh Barnea' },
                { lat: 31.8558, lng: 35.4614, name: 'Jericho' },
                { lat: 31.7683, lng: 35.2137, name: 'Jerusalem region' }
            ])
        },
        {
            name: "Jesus' Ministry in Galilee",
            nameUkrainian: 'Служіння Ісуса в Галілеї',
            description: 'Key locations of Jesus\' ministry around the Sea of Galilee',
            descriptionUa: 'Ключові місця служіння Ісуса навколо Галілейського моря',
            category: 'jesus_ministry',
            color: '#00FF88',
            waypoints: JSON.stringify([
                { lat: 32.7009, lng: 35.2988, name: 'Nazareth' },
                { lat: 32.7922, lng: 35.4983, name: 'Cana' },
                { lat: 32.8792, lng: 35.5750, name: 'Capernaum' },
                { lat: 32.8156, lng: 35.5947, name: 'Sea of Galilee' },
                { lat: 32.8167, lng: 35.5000, name: 'Magdala' },
                { lat: 32.8881, lng: 35.5653, name: 'Bethsaida' },
                { lat: 33.2654, lng: 35.5947, name: 'Caesarea Philippi' },
                { lat: 32.4500, lng: 35.3000, name: 'Mount Tabor' }
            ])
        }
    ];

    for (const journey of journeys) {
        await prisma.journey.upsert({
            where: { id: journeys.indexOf(journey) + 1 },
            update: journey,
            create: journey
        });
    }

    console.log(`✓ Seeded ${journeys.length} journey routes`);
    console.log('Map data seeding complete!');
}

seedMapData()
    .catch((e) => {
        console.error('Error seeding map data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
