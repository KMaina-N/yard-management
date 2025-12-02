/*
  Warnings:

  - You are about to drop the column `productTypeId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Booking` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Booking] DROP CONSTRAINT [Booking_productTypeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ProductType] DROP CONSTRAINT [ProductType_yardId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Booking] DROP COLUMN [productTypeId],
[quantity];

-- CreateTable
CREATE TABLE [dbo].[Goods] (
    [id] NVARCHAR(1000) NOT NULL,
    [bookingId] NVARCHAR(1000) NOT NULL,
    [typeId] NVARCHAR(1000) NOT NULL,
    [quantities] INT NOT NULL,
    [numberOfPallets] INT,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Goods_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Goods_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Goods] ADD CONSTRAINT [Goods_bookingId_fkey] FOREIGN KEY ([bookingId]) REFERENCES [dbo].[Booking]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Goods] ADD CONSTRAINT [Goods_typeId_fkey] FOREIGN KEY ([typeId]) REFERENCES [dbo].[ProductType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProductType] ADD CONSTRAINT [ProductType_yardId_fkey] FOREIGN KEY ([yardId]) REFERENCES [dbo].[Yard]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
