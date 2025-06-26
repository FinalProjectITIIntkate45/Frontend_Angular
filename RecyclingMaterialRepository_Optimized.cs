using Models.Entities;
using Data.Context;
using ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Repositories
{
    /// <summary>
    /// Optimized Repository to manage all data operations for RecyclingMaterial
    /// </summary>
    public class RecyclingMaterialRepository : BaseRepository<RecyclingMaterial>
    {
        public RecyclingMaterialRepository(AppDbContext context) : base(context)
        {
        }

        /// <summary>
        /// Optimized: Gets all materials with efficient querying
        /// </summary>
        public async Task<List<RecyclingMaterialViewModel>> GetAllAsync()
        {
            // ✅ Use projection to select only needed fields directly from database
            var materials = await base.GetAll()
                .Select(m => new RecyclingMaterialViewModel
                {
                    Id = m.Id,
                    Name = m.Name,
                    UnitType = m.UnitType,
                    PointsPerUnit = m.PointsPerUnit,
                    MaterialImage = m.MaterialImage,
                    // ✅ Calculate counts efficiently using SQL
                    TotalRecyclingRequests = m.RecyclingRequests.Count,
                    TotalScrapAuctions = m.ScrapAuctions.Count
                })
                .ToListAsync();

            return materials;
        }

        /// <summary>
        /// Optimized: Gets all materials with stats using efficient joins
        /// </summary>
        public async Task<List<RecyclingMaterialViewModel>> GetAllWithStatsAsync()
        {
            // ✅ Use efficient joins instead of separate queries
            var materials = await base.GetAll()
                .Select(m => new RecyclingMaterialViewModel
                {
                    Id = m.Id,
                    Name = m.Name,
                    UnitType = m.UnitType,
                    PointsPerUnit = m.PointsPerUnit,
                    MaterialImage = m.MaterialImage,
                    TotalRecyclingRequests = m.RecyclingRequests.Count,
                    TotalScrapAuctions = m.ScrapAuctions.Count
                })
                .ToListAsync();

            return materials;
        }

        /// <summary>
        /// Optimized: Get material by ID with projection
        /// </summary>
        public async Task<RecyclingMaterialViewModel> GetByIdAsync(int id)
        {
            var material = await base.GetAll()
                .Where(m => m.Id == id)
                .Select(m => new RecyclingMaterialViewModel
                {
                    Id = m.Id,
                    Name = m.Name,
                    UnitType = m.UnitType,
                    PointsPerUnit = m.PointsPerUnit,
                    MaterialImage = m.MaterialImage,
                    TotalRecyclingRequests = m.RecyclingRequests.Count,
                    TotalScrapAuctions = m.ScrapAuctions.Count
                })
                .FirstOrDefaultAsync();

            return material;
        }

        /// <summary>
        /// Get a single RecyclingMaterial entity by ID for editing
        /// </summary>
        public async Task<RecyclingMaterialEditViewModel?> GetEditViewModelByIdAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            return entity?.ToEditViewModel();
        }

        /// <summary>
        /// Creates and saves a new RecyclingMaterial from CreateViewModel
        /// </summary>
        public async Task AddAsync(RecyclingMaterialCreateViewModel model)
        {
            var entity = model.ToEntity();
            await base.AddAsync(entity);
        }

        /// <summary>
        /// Updates an existing RecyclingMaterial from EditViewModel
        /// </summary>
        public async Task<bool> UpdateAsync(RecyclingMaterialEditViewModel model)
        {
            if (model == null)
                return false;

            var editModel = model.ToEntity();
            await base.UpdateAsync(editModel);
            await base.SaveChangesAsync();

            return true;
        }

        /// <summary>
        /// Deletes a RecyclingMaterial by ID
        /// </summary>
        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null)
                return false;
            var deletedEntity = entity.ToEntity();
            await base.DeleteAsync(deletedEntity);
            return true;
        }
    }
} 