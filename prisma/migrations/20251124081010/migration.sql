BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[DeliverySchedule] (
    [id] NVARCHAR(1000) NOT NULL,
    [week] NVARCHAR(1000) NOT NULL,
    [totalCapacity] INT NOT NULL,
    [tolerance] FLOAT(53),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DeliverySchedule_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [DeliverySchedule_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DeliverySchedule_week_key] UNIQUE NONCLUSTERED ([week])
);

-- CreateTable
CREATE TABLE [dbo].[DeliveryRuleDay] (
    [id] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL,
    [capacity] INT NOT NULL,
    [isSaved] BIT NOT NULL CONSTRAINT [DeliveryRuleDay_isSaved_df] DEFAULT 0,
    [deliveryScheduleId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DeliveryRuleDay_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [DeliveryRuleDay_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DeliveryRuleDay_date_deliveryScheduleId_key] UNIQUE NONCLUSTERED ([date],[deliveryScheduleId])
);

-- AddForeignKey
ALTER TABLE [dbo].[DeliveryRuleDay] ADD CONSTRAINT [DeliveryRuleDay_deliveryScheduleId_fkey] FOREIGN KEY ([deliveryScheduleId]) REFERENCES [dbo].[DeliverySchedule]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
