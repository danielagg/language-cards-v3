-- CreateTable
CREATE TABLE "LanguageCard" (
    "id" TEXT NOT NULL,
    "spanish" TEXT NOT NULL,
    "englishTranslations" TEXT[],
    "allAttemptedAnswerCount" INTEGER NOT NULL DEFAULT 0,
    "correctAnswerCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LanguageCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LanguageCard_id_key" ON "LanguageCard"("id");
