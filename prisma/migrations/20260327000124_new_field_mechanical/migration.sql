/*
  Warnings:

  - Added the required column `mechanicalItems` to the `Quotation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "mechanicalItems" JSONB NOT NULL;
