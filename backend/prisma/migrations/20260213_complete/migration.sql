-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "studyPad" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "BibleVersion" (
    "id" SERIAL PRIMARY KEY,
    "code" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "bibleVersionId" INTEGER NOT NULL,
    CONSTRAINT "Book_bibleVersionId_fkey" FOREIGN KEY ("bibleVersionId") REFERENCES "BibleVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    CONSTRAINT "Chapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Verse" (
    "id" SERIAL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,
    CONSTRAINT "Verse_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "verseId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Note_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Highlight" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "verseId" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Highlight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Highlight_verseId_fkey" FOREIGN KEY ("verseId") REFERENCES "Verse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "number" TEXT NOT NULL UNIQUE,
    "language" TEXT NOT NULL,
    "transliteration" TEXT,
    "pronunciation" TEXT,
    "definition" TEXT NOT NULL,
    "definitionUkrainian" TEXT
);

-- CreateTable
CREATE TABLE "MapLocation" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameUkrainian" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "descriptionUkrainian" TEXT,
    "biblicalReferences" TEXT
);

-- CreateTable
CREATE TABLE "Journey" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameUkrainian" TEXT,
    "description" TEXT,
    "descriptionUkrainian" TEXT,
    "path" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#0033FF'
);

-- CreateTable
CREATE TABLE "MapSnapshot" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "center" TEXT NOT NULL,
    "zoom" REAL NOT NULL,
    "bearing" REAL NOT NULL DEFAULT 0,
    "pitch" REAL NOT NULL DEFAULT 0,
    "visibleLocations" TEXT,
    "visibleJourneys" TEXT,
    "imageData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MapSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_bibleVersionId_number_key" ON "Book"("bibleVersionId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_bookId_number_key" ON "Chapter"("bookId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Verse_chapterId_number_key" ON "Verse"("chapterId", "number");
