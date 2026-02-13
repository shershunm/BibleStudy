-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "BibleVersion" (
    "id" SERIAL PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "hasStrongs" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL PRIMARY KEY,
    "versionId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "testament" TEXT NOT NULL,
    CONSTRAINT "Book_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "BibleVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL PRIMARY KEY,
    "bookId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    CONSTRAINT "Chapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Verse" (
    "id" SERIAL PRIMARY KEY,
    "chapterId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "strongs" TEXT,
    CONSTRAINT "Verse_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerseNote" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "versionCode" TEXT NOT NULL,
    "bookNumber" INTEGER NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "verseNumber" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VerseNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudyNote" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StudyNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StrongsEntry" (
    "id" SERIAL PRIMARY KEY,
    "strongsNumber" TEXT NOT NULL UNIQUE,
    "language" TEXT NOT NULL,
    "transliteration" TEXT,
    "pronunciation" TEXT,
    "definition" TEXT NOT NULL,
    "kjvUsage" TEXT
);

-- CreateTable
CREATE TABLE "MapLocation" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameUkrainian" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionUa" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "biblicalPeriod" TEXT NOT NULL,
    "verseReferences" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Journey" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameUkrainian" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionUa" TEXT NOT NULL,
    "waypoints" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#0033FF',
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MapSnapshot" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "center" TEXT NOT NULL,
    "zoom" DOUBLE PRECISION NOT NULL,
    "bearing" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pitch" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MapSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_versionId_number_key" ON "Book"("versionId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_bookId_number_key" ON "Chapter"("bookId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Verse_chapterId_number_key" ON "Verse"("chapterId", "number");

-- CreateIndex
CREATE INDEX "VerseNote_userId_idx" ON "VerseNote"("userId");

-- CreateIndex
CREATE INDEX "StudyNote_userId_idx" ON "StudyNote"("userId");

-- CreateIndex
CREATE INDEX "MapSnapshot_userId_idx" ON "MapSnapshot"("userId");
