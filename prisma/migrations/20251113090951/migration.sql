/*
  Warnings:

  - You are about to drop the column `location` on the `Yard` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Yard] ALTER COLUMN [capacity] INT NULL;
ALTER TABLE [dbo].[Yard] DROP COLUMN [location];
ALTER TABLE [dbo].[Yard] ADD [address] NVARCHAR(1000) NOT NULL CONSTRAINT [Yard_address_df] DEFAULT '';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
