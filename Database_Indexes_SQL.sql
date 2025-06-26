-- Database Indexes for Recycling Performance Optimization
-- Run these scripts on your database to improve query performance

-- 1. Indexes for RecyclingMaterial table
CREATE INDEX IX_RecyclingMaterial_Name ON RecyclingMaterials (Name);
CREATE INDEX IX_RecyclingMaterial_UnitType ON RecyclingMaterials (UnitType);
CREATE INDEX IX_RecyclingMaterial_PointsPerUnit ON RecyclingMaterials (PointsPerUnit);

-- 2. Indexes for RecyclingRequest table
CREATE INDEX IX_RecyclingRequest_ClientId ON RecyclingRequests (ClientId);
CREATE INDEX IX_RecyclingRequest_MaterialId ON RecyclingRequests (MaterialId);
CREATE INDEX IX_RecyclingRequest_Status ON RecyclingRequests (Status);
CREATE INDEX IX_RecyclingRequest_CreatedAt ON RecyclingRequests (CreatedAt);
CREATE INDEX IX_RecyclingRequest_ClientId_CreatedAt ON RecyclingRequests (ClientId, CreatedAt DESC);

-- 3. Composite indexes for common query patterns
CREATE INDEX IX_RecyclingRequest_ClientId_Status ON RecyclingRequests (ClientId, Status);
CREATE INDEX IX_RecyclingRequest_MaterialId_Status ON RecyclingRequests (MaterialId, Status);

-- 4. Foreign key indexes (if not already created by EF)
CREATE INDEX IX_RecyclingRequest_ClientId_FK ON RecyclingRequests (ClientId);
CREATE INDEX IX_RecyclingRequest_MaterialId_FK ON RecyclingRequests (MaterialId);

-- 5. Covering indexes for frequently accessed data
CREATE INDEX IX_RecyclingMaterial_Covering ON RecyclingMaterials (Id, Name, UnitType, PointsPerUnit, MaterialImage);

-- 6. Index for date range queries
CREATE INDEX IX_RecyclingRequest_CreatedAt_Status ON RecyclingRequests (CreatedAt, Status);

-- 7. If you have a lot of data, consider partitioning by date
-- (This is advanced and depends on your SQL Server version)
-- CREATE PARTITION FUNCTION PF_RecyclingRequest_Date (datetime)
-- AS RANGE RIGHT FOR VALUES ('2024-01-01', '2024-07-01', '2025-01-01');

-- 8. Statistics update (run periodically)
UPDATE STATISTICS RecyclingMaterials;
UPDATE STATISTICS RecyclingRequests;

-- 9. Check index usage (run this to see which indexes are being used)
-- SELECT 
--     OBJECT_NAME(i.object_id) AS TableName,
--     i.name AS IndexName,
--     ius.user_seeks,
--     ius.user_scans,
--     ius.user_lookups,
--     ius.user_updates
-- FROM sys.dm_db_index_usage_stats ius
-- INNER JOIN sys.indexes i ON ius.object_id = i.object_id AND ius.index_id = i.index_id
-- WHERE OBJECT_NAME(i.object_id) IN ('RecyclingMaterials', 'RecyclingRequests')
-- ORDER BY ius.user_seeks + ius.user_scans + ius.user_lookups DESC; 