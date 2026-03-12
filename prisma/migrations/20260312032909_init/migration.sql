-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL,
    "folio" SERIAL NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientAddress" TEXT NOT NULL,
    "vehicleBrand" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleYear" TEXT NOT NULL,
    "vehicleColor" TEXT NOT NULL,
    "vehiclePlates" TEXT NOT NULL,
    "vehiclePaintCode" TEXT NOT NULL,
    "services" JSONB NOT NULL,
    "customService" TEXT,
    "estimatedTime" TEXT NOT NULL,
    "piecesToWork" INTEGER NOT NULL DEFAULT 1,
    "bodyworkItems" JSONB NOT NULL,
    "paintItems" JSONB NOT NULL,
    "partItems" JSONB NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "downPayment" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "remainingBalance" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_folio_key" ON "Quotation"("folio");

-- CreateIndex
CREATE INDEX "Quotation_folio_idx" ON "Quotation"("folio");

-- CreateIndex
CREATE INDEX "Quotation_clientName_idx" ON "Quotation"("clientName");

-- CreateIndex
CREATE INDEX "Quotation_vehicleBrand_idx" ON "Quotation"("vehicleBrand");

-- CreateIndex
CREATE INDEX "Quotation_createdAt_idx" ON "Quotation"("createdAt");
