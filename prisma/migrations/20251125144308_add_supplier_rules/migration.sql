BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[SupplierRule] (
    [id] NVARCHAR(1000) NOT NULL,
    [supplierName] NVARCHAR(1000) NOT NULL,
    [day] NVARCHAR(1000) NOT NULL,
    [allocatedCapacity] INT NOT NULL,
    [tolerance] INT NOT NULL CONSTRAINT [SupplierRule_tolerance_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [SupplierRule_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [SupplierRule_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
