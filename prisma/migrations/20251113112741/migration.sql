/*
  Warnings:

  - You are about to drop the `_ProductTypeToYard` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_ProductTypeToYard] DROP CONSTRAINT [_ProductTypeToYard_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_ProductTypeToYard] DROP CONSTRAINT [_ProductTypeToYard_B_fkey];

-- DropTable
DROP TABLE [dbo].[_ProductTypeToYard];

-- CreateTable
CREATE TABLE [dbo].[_YardProductTypes] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_YardProductTypes_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_YardProductTypes_B_index] ON [dbo].[_YardProductTypes]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ProductType_yardId_idx] ON [dbo].[ProductType]([yardId]);

-- AddForeignKey
ALTER TABLE [dbo].[_YardProductTypes] ADD CONSTRAINT [_YardProductTypes_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[ProductType]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_YardProductTypes] ADD CONSTRAINT [_YardProductTypes_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Yard]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
