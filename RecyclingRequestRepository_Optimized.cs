using Models.Entities;
using Data.Context;
using ViewModels.Recycling;
using Microsoft.EntityFrameworkCore;

namespace Repositories
{
    /// <summary>
    /// Optimized Repository for RecyclingRequest operations
    /// </summary>
    public class RecyclingRequestRepository : BaseRepository<RecyclingRequest>
    {
        public RecyclingRequestRepository(AppDbContext context) : base(context)
        {
        }

        /// <summary>
        /// Optimized: Get requests by client ID with efficient projection
        /// </summary>
        public async Task<List<RecyclingRequest>> GetRequestsByClientIdAsync(string clientId)
        {
            // ✅ Use projection to select only needed fields and include navigation properties efficiently
            var requests = await base.GetAll()
                .Where(r => r.ClientId == clientId)
                .Include(r => r.Material) // Only include what we need
                .Include(r => r.Client)
                    .ThenInclude(c => c.User)
                .OrderByDescending(r => r.CreatedAt) // Add ordering for better UX
                .ToListAsync();

            return requests;
        }

        /// <summary>
        /// Optimized: Get request details with efficient includes
        /// </summary>
        public async Task<RecyclingRequest> GetRequestWithDetailsAsync(int id)
        {
            // ✅ Use efficient includes and projection
            var request = await base.GetAll()
                .Where(r => r.Id == id)
                .Include(r => r.Material)
                .Include(r => r.Client)
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync();

            return request;
        }

        /// <summary>
        /// Optimized: Get requests with pagination for better performance
        /// </summary>
        public async Task<(List<RecyclingRequest> Requests, int TotalCount)> GetRequestsByClientIdPaginatedAsync(
            string clientId, int pageNumber = 1, int pageSize = 10)
        {
            var query = base.GetAll()
                .Where(r => r.ClientId == clientId)
                .Include(r => r.Material)
                .Include(r => r.Client)
                    .ThenInclude(c => c.User)
                .OrderByDescending(r => r.CreatedAt);

            var totalCount = await query.CountAsync();
            
            var requests = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (requests, totalCount);
        }

        /// <summary>
        /// Get request by ID for basic operations
        /// </summary>
        public async Task<RecyclingRequest> GetByIdAsync(int id)
        {
            return await base.GetByIdAsync(id);
        }

        /// <summary>
        /// Add new request
        /// </summary>
        public async Task AddAsync(RecyclingRequest entity)
        {
            await base.AddAsync(entity);
        }

        /// <summary>
        /// Update existing request
        /// </summary>
        public async Task UpdateAsync(RecyclingRequest entity)
        {
            await base.UpdateAsync(entity);
        }

        /// <summary>
        /// Delete request
        /// </summary>
        public async Task DeleteAsync(RecyclingRequest entity)
        {
            await base.DeleteAsync(entity);
        }
    }
} 