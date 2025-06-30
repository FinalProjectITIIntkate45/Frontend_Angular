using Repositories;
using ViewModels.Recycling;
using Models.Enums;

namespace Services
{
    public class RecyclingRequestService
    {
        private readonly RecyclingRequestRepository _repository;

        public RecyclingRequestService(RecyclingRequestRepository repository)
        {
            _repository = repository;
        }

        // Existing methods for clients
        public async Task AddAsync(RecyclingRequestCreateViewModel model, string clientid)
        {
            var entity = model.ToEntity(clientid);
            await _repository.AddAsync(entity);
        }

        public async Task<List<RecyclingRequestListItemViewModel>> GetMyRequestsAsync(string clientId)
        {
            var requests = await _repository.GetRequestsByClientIdAsync(clientId);
            var viewModels = requests.Select(r => r.ToListItemViewModel()).ToList();
            return viewModels;
        }

        public async Task<RecyclingRequestDetailsViewModel> GetRequestDetailsAsync(int id, string clientId = null)
        {
            var request = await _repository.GetRequestWithDetailsAsync(id);

            // If clientId is provided, check if request belongs to the authenticated user
            if (clientId != null && request?.ClientId != clientId)
                return null;

            return request?.ToViewModel();
        }

        public async Task UpdateRequestAsync(RecyclingRequestEditViewModel model, string adminId)
        {
            var existing = await _repository.GetRequestWithDetailsAsync(model.Id);

            if (existing == null)
                throw new InvalidOperationException("Request not found");

            var updated = model.ToEntity(existing);
            await _repository.UpdateAsync(updated);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                return false;

            await _repository.DeleteAsync(entity);
            return true;
        }

        // New admin methods
        public async Task<List<RecyclingRequestListItemViewModel>> GetAllRequestsAsync(
            string status = "", string searchTerm = "", int page = 1, int pageSize = 10)
        {
            var (requests, totalCount) = await _repository.GetAllRequestsPaginatedAsync(status, searchTerm, page, pageSize);
            var viewModels = requests.Select(r => r.ToListItemViewModel()).ToList();
            return viewModels;
        }

        public async Task<RecyclingRequestStatisticsViewModel> GetStatisticsAsync()
        {
            var stats = await _repository.GetStatisticsAsync();
            return new RecyclingRequestStatisticsViewModel
            {
                TotalRequests = stats.TotalRequests,
                PendingRequests = stats.PendingRequests,
                ApprovedRequests = stats.ApprovedRequests,
                RejectedRequests = stats.RejectedRequests,
                CompletedRequests = stats.CompletedRequests,
                TotalPointsAwarded = stats.TotalPointsAwarded,
                AverageProcessingTime = stats.AverageProcessingTime,
                TopMaterials = stats.TopMaterials,
                MonthlyStats = stats.MonthlyStats
            };
        }

        public async Task<int> BulkApproveAsync(int[] requestIds, string adminId)
        {
            int successCount = 0;
            foreach (var id in requestIds)
            {
                try
                {
                    var request = await _repository.GetRequestWithDetailsAsync(id);
                    if (request != null && request.Status == RecyclingRequestStatus.Pending)
                    {
                        var editModel = new RecyclingRequestEditViewModel
                        {
                            Id = id,
                            Status = RecyclingRequestStatus.Accepted,
                            PointsAwarded = request.Material?.PointsPerUnit * request.Quantity ?? 0,
                            UnitType = request.UnitType,
                            RequestImage = request.RequestImage
                        };

                        await UpdateRequestAsync(editModel, adminId);
                        successCount++;
                    }
                }
                catch (Exception ex)
                {
                    // Log error but continue with other requests
                    Console.WriteLine($"Error approving request {id}: {ex.Message}");
                }
            }
            return successCount;
        }

        public async Task<int> BulkRejectAsync(int[] requestIds, string adminId)
        {
            int successCount = 0;
            foreach (var id in requestIds)
            {
                try
                {
                    var request = await _repository.GetRequestWithDetailsAsync(id);
                    if (request != null && request.Status == RecyclingRequestStatus.Pending)
                    {
                        var editModel = new RecyclingRequestEditViewModel
                        {
                            Id = id,
                            Status = RecyclingRequestStatus.Rejected,
                            PointsAwarded = 0,
                            UnitType = request.UnitType,
                            RequestImage = request.RequestImage
                        };

                        await UpdateRequestAsync(editModel, adminId);
                        successCount++;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error rejecting request {id}: {ex.Message}");
                }
            }
            return successCount;
        }

        public async Task<int> BulkDeleteAsync(int[] requestIds)
        {
            int successCount = 0;
            foreach (var id in requestIds)
            {
                try
                {
                    if (await DeleteAsync(id))
                        successCount++;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error deleting request {id}: {ex.Message}");
                }
            }
            return successCount;
        }

        public async Task<List<RecyclingRequestListItemViewModel>> GetRequestsByStatusAsync(RecyclingRequestStatus status)
        {
            var requests = await _repository.GetRequestsByStatusAsync(status);
            var viewModels = requests.Select(r => r.ToListItemViewModel()).ToList();
            return viewModels;
        }

        public async Task<List<RecyclingRequestListItemViewModel>> GetRequestsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var requests = await _repository.GetRequestsByDateRangeAsync(startDate, endDate);
            var viewModels = requests.Select(r => r.ToListItemViewModel()).ToList();
            return viewModels;
        }
    }
} 