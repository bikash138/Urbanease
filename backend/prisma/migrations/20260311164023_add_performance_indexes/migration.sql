-- CreateIndex
CREATE INDEX "Address_customerId_idx" ON "Address"("customerId");

-- CreateIndex
CREATE INDEX "Booking_customerId_idx" ON "Booking"("customerId");

-- CreateIndex
CREATE INDEX "Booking_providerServiceId_idx" ON "Booking"("providerServiceId");

-- CreateIndex
CREATE INDEX "BookingImage_bookingId_idx" ON "BookingImage"("bookingId");

-- CreateIndex
CREATE INDEX "ProviderProfile_status_idx" ON "ProviderProfile"("status");

-- CreateIndex
CREATE INDEX "ProviderService_serviceId_isAvailable_idx" ON "ProviderService"("serviceId", "isAvailable");

-- CreateIndex
CREATE INDEX "ProviderService_providerId_idx" ON "ProviderService"("providerId");

-- CreateIndex
CREATE INDEX "Review_providerId_idx" ON "Review"("providerId");

-- CreateIndex
CREATE INDEX "Review_status_idx" ON "Review"("status");

-- CreateIndex
CREATE INDEX "Service_categoryId_isActive_idx" ON "Service"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "ServiceCategory_isActive_idx" ON "ServiceCategory"("isActive");
