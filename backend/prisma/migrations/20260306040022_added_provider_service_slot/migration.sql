-- CreateTable
CREATE TABLE "_ProviderServiceToSlot" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProviderServiceToSlot_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProviderServiceToSlot_B_index" ON "_ProviderServiceToSlot"("B");

-- AddForeignKey
ALTER TABLE "_ProviderServiceToSlot" ADD CONSTRAINT "_ProviderServiceToSlot_A_fkey" FOREIGN KEY ("A") REFERENCES "ProviderService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProviderServiceToSlot" ADD CONSTRAINT "_ProviderServiceToSlot_B_fkey" FOREIGN KEY ("B") REFERENCES "Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
