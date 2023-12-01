-- CreateTable
CREATE TABLE "News" (
    "uutisId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "otsikko" TEXT NOT NULL,
    "sisalto" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Comment" (
    "kommenttiId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uutisId" TEXT NOT NULL,
    "kayttajatunnus" TEXT NOT NULL,
    "kommentti" TEXT NOT NULL,
    "aikaleima" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "kayttajaId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kayttajatunnus" TEXT NOT NULL,
    "salasana" TEXT NOT NULL
);
