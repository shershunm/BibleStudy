-- CreateTable
CREATE TABLE "DictionaryEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "headword" TEXT NOT NULL,
    "transliteration" TEXT,
    "definition" TEXT NOT NULL,
    "pronunciation" TEXT,
    "strongsNumber" TEXT
);

-- CreateTable
CREATE TABLE "MapLocation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "description" TEXT,
    "biblicalEra" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "DictionaryEntry_code_key" ON "DictionaryEntry"("code");
