using Models.Entities;
using Data.Context;
using ViewModels.Recycling;
using Microsoft.EntityFrameworkCore;
using Models.Enums;

namespace Repositories
{
    /// <summary>
    /// Enhanced Repository for RecyclingRequest operations with admin functionality
    /// </summary>
    public class RecyclingRequestRepository : BaseRepository<RecyclingRequest>
    {
        public RecyclingRequestRepository(AppDbContext context) : base(context)
        {
        }

        // Existing methods
        public async Task<List<RecyclingRequest>> GetRequestsByClientIdAsync(string clientId)
        {
            var requests = await base.GetAll()
                .Where(r => r.ClientId == clientId)
                .Include(r => r.Material)
                .Include(r => r.Client)
                    .ThenInclude(c => c.User)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return requests;
        }

        public async Task<RecyclingRequest> GetRequestWithDetailsAsync(int id)
        {
            var request = await base.GetAll()
                .Where(r => r.Id == id)
                .Include(r => r.Material)
                .Include(r => r.Client)
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync();

            return request;
        }

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

        // New admin methods
        public async Task<(List<RecyclingRequest> Requests, int TotalCount)> GetAllRequestsPaginatedAsync(
            string status = "", string searchTerm = "", int page = 1, int pageSize = 10)
        {
            var query = base.GetAll()
                .Include(r => r.Material)
                .Include(r => r.Client)
                    .ThenInclude(c => c.User)
                .AsQueryable();

            // Apply status filter
            if (!string.IsNullOrEmpty(status) && Enum.TryParse<RecyclingRequestStatus>(status, out var statusEnum))
            {
                query = query.Where(r => r.Status == statusEnum);
            }

            // Apply search filter
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(r => 
                    r.Material.Name.Contains(searchTerm) ||
                    r.Client.User.UserName.Contains(searchTerm) ||
                    r.City.Contains(searchTerm) ||
                    r.Address.Contains(searchTerm)
                );
            }

            var totalCount = await query.CountAsync();

            var requests = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (requests, totalCount);
        }

        public async Task<RecyclingRequestStatistics> GetStatisticsAsync()
        {
            var totalRequests = await base.GetAll().CountAsync();
            var pendingRequests = await base.GetAll().CountAsync(r => r.Status == RecyclingRequestStatus.Pending);
            var approvedRequests = await base.GetAll().CountAsync(r => r.Status == RecyclingRequestStatus.Accepted);
            var rejectedRequests = await base.GetAll().CountAsync(r => r.Status == RecyclingRequestStatus.Rejected);
            var completedRequests = await base.GetAll().CountAsync(r => r.Status == RecyclingRequestStatus.Completed);

            var totalPointsAwarded = await base.GetAll()
                .Where(r => r.PointsAwarded.HasValue)
                .SumAsync(r => r.PointsAwarded.Value);

            // Calculate average processing time (for completed requests)
            var completedRequestsWithDates = await base.GetAll()
                .Where(r => r.Status == RecyclingRequestStatus.Completed && r.CreatedAt.HasValue)
                .Select(r => new { r.CreatedAt, r.ModifiedAt })
                .ToListAsync();

            var averageProcessingTime = completedRequestsWithDates.Any() 
                ? completedRequestsWithDates.Average(r => 
                    (r.ModifiedAt ?? DateTime.UtcNow) - r.CreatedAt.Value).TotalHours
                : 0;

            // Get top materials
            var topMaterials = await base.GetAll()
                .Include(r => r.Material)
                .GroupBy(r => r.Material.Name)
                .Select(g => new { MaterialName = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .Take(5)
                .ToListAsync();

            // Get monthly statistics
            var monthlyStats = await base.GetAll()
                .Where(r => r.CreatedAt.HasValue && r.CreatedAt.Value >= DateTime.UtcNow.AddMonths(-6))
                .GroupBy(r => new { r.CreatedAt.Value.Year, r.CreatedAt.Value.Month })
                .Select(g => new { 
                    Year = g.Key.Year, 
                    Month = g.Key.Month, 
                    Count = g.Count(),
                    Points = g.Sum(r => r.PointsAwarded ?? 0)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();

            return new RecyclingRequestStatistics
            {
                TotalRequests = totalRequests,
                PendingRequests = pendingRequests,
                ApprovedRequests = approvedRequests,
                RejectedRequests = rejectedRequests,
                CompletedRequests = completedRequests,
                TotalPointsAwarded = totalPointsAwarded,
                AverageProcessingTime = averageProcessingTime,
                TopMaterials = topMaterials.Select(t => new TopMaterial { Name = t.MaterialName, Count = t.Count }).ToList(),
                MonthlyStats = monthlyStats.Select(m => new MonthlyStat { 
                    Year = m.Year, 
                    Month = m.Month, 
                    Count = m.Count, 
                    Points = m.Points 
                }).ToList()
            };
        }

        public async Task<List<RecyclingRequest>> GetRequestsByStatusAsync(RecyclingRequestStatus status)
        {
            return await base.GetAll()
                .Where(r => r.Status == status)
                .Include(r => r.Material)
                .Include(r => r.Client)
                    .ThenInclude(c => c.User)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<RecyclingRequest>> GetRequestsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await base.GetAll()
                .Where(r => r.CreatedAt >= startDate && r.CreatedAt <= endDate)
                .Include(r => r.Material)
                .Include(r => r.Client)
                    .ThenInclude(c => c.User)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        // Basic CRUD operations
        public async Task<RecyclingRequest> GetByIdAsync(int id)
        {
            return await base.GetByIdAsync(id);
        }

        public async Task AddAsync(RecyclingRequest entity)
        {
            await base.AddAsync(entity);
        }

        public async Task UpdateAsync(RecyclingRequest entity)
        {
            await base.UpdateAsync(entity);
        }

        public async Task DeleteAsync(RecyclingRequest entity)
        {
            await base.DeleteAsync(entity);
        }
    }

    // Statistics models
    public class RecyclingRequestStatistics
    {
        public int TotalRequests { get; set; }
        public int PendingRequests { get; set; }
        public int ApprovedRequests { get; set; }
        public int RejectedRequests { get; set; }
        public int CompletedRequests { get; set; }
        public int TotalPointsAwarded { get; set; }
        public double AverageProcessingTime { get; set; }
        public List<TopMaterial> TopMaterials { get; set; } = new();
        public List<MonthlyStat> MonthlyStats { get; set; } = new();
    }

    public class TopMaterial
    {
        public string Name { get; set; } = "";
        public int Count { get; set; }
    }

    public class MonthlyStat
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Count { get; set; }
        public int Points { get; set; }
    }
} 