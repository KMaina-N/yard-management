/*
  Warnings:

  - You are about to drop the `_YardProductTypes` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_YardProductTypes] DROP CONSTRAINT [_YardProductTypes_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_YardProductTypes] DROP CONSTRAINT [_YardProductTypes_B_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Booking] DROP CONSTRAINT [Booking_productTypeId_fkey];

-- DropTable
DROP TABLE [dbo].[_YardProductTypes];

-- AddForeignKey
ALTER TABLE [dbo].[Booking] ADD CONSTRAINT [Booking_productTypeId_fkey] FOREIGN KEY ([productTypeId]) REFERENCES [dbo].[ProductType]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProductType] ADD CONSTRAINT [ProductType_yardId_fkey] FOREIGN KEY ([yardId]) REFERENCES [dbo].[Yard]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
