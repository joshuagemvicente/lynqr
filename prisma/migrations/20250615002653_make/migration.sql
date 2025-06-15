/*
  Warnings:

  - A unique constraint covering the columns `[linkUsername]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_linkUsername_key" ON "user"("linkUsername");
