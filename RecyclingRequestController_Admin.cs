using Microsoft.AspNetCore.Mvc;
using Services;
using ViewModels.Recycling;
using System.Security.Claims;

namespace PointFayMVC.Controllers.Admin
{
    public class RecyclingRequestController : Controller
    {
        private readonly RecyclingRequestService _recyclingRequestService;

        public RecyclingRequestController(RecyclingRequestService recyclingRequestService)
        {
            _recyclingRequestService = recyclingRequestService;
        }

        // GET: Admin/RecyclingRequest
        public async Task<IActionResult> Index(string status = "", string searchTerm = "", int page = 1)
        {
            try
            {
                // Get all requests with filtering and pagination
                var requests = await _recyclingRequestService.GetAllRequestsAsync(status, searchTerm, page, 10);
                
                ViewBag.Status = status;
                ViewBag.SearchTerm = searchTerm;
                ViewBag.CurrentPage = page;
                
                return View(requests);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to load recycling requests.";
                return View(new List<RecyclingRequestListItemViewModel>());
            }
        }

        // GET: Admin/RecyclingRequest/Details/5
        public async Task<IActionResult> Details(int id)
        {
            try
            {
                var request = await _recyclingRequestService.GetRequestDetailsAsync(id);
                if (request == null)
                {
                    TempData["Error"] = "Request not found.";
                    return RedirectToAction(nameof(Index));
                }

                return View(request);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to load request details.";
                return RedirectToAction(nameof(Index));
            }
        }

        // GET: Admin/RecyclingRequest/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            try
            {
                var request = await _recyclingRequestService.GetRequestDetailsAsync(id);
                if (request == null)
                {
                    TempData["Error"] = "Request not found.";
                    return RedirectToAction(nameof(Index));
                }

                var editModel = new RecyclingRequestEditViewModel
                {
                    Id = request.Id,
                    Status = request.Status,
                    PointsAwarded = request.PointsAwarded,
                    UnitType = request.UnitType,
                    RequestImage = request.RequestImage
                };

                return View(editModel);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to load request for editing.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/RecyclingRequest/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, RecyclingRequestEditViewModel model)
        {
            if (id != model.Id)
            {
                TempData["Error"] = "Request ID mismatch.";
                return RedirectToAction(nameof(Index));
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            try
            {
                // Get admin ID for audit trail
                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "admin";
                
                await _recyclingRequestService.UpdateRequestAsync(model, adminId);
                
                TempData["Success"] = "Request updated successfully.";
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to update request.";
                return View(model);
            }
        }

        // GET: Admin/RecyclingRequest/Delete/5
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var request = await _recyclingRequestService.GetRequestDetailsAsync(id);
                if (request == null)
                {
                    TempData["Error"] = "Request not found.";
                    return RedirectToAction(nameof(Index));
                }

                return View(request);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to load request for deletion.";
                return RedirectToAction(nameof(Index));
            }
        }

        // POST: Admin/RecyclingRequest/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            try
            {
                var deleted = await _recyclingRequestService.DeleteAsync(id);
                if (deleted)
                {
                    TempData["Success"] = "Request deleted successfully.";
                }
                else
                {
                    TempData["Error"] = "Failed to delete request.";
                }
            }
            catch (Exception ex)
            {
                TempData["Error"] = "An error occurred while deleting the request.";
            }

            return RedirectToAction(nameof(Index));
        }

        // GET: Admin/RecyclingRequest/Statistics
        public async Task<IActionResult> Statistics()
        {
            try
            {
                var stats = await _recyclingRequestService.GetStatisticsAsync();
                return View(stats);
            }
            catch (Exception ex)
            {
                TempData["Error"] = "Failed to load statistics.";
                return View(new RecyclingRequestStatisticsViewModel());
            }
        }

        // POST: Admin/RecyclingRequest/BulkAction
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> BulkAction(int[] requestIds, string action)
        {
            if (requestIds == null || !requestIds.Any())
            {
                TempData["Error"] = "No requests selected.";
                return RedirectToAction(nameof(Index));
            }

            try
            {
                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "admin";
                int successCount = 0;

                switch (action.ToLower())
                {
                    case "approve":
                        successCount = await _recyclingRequestService.BulkApproveAsync(requestIds, adminId);
                        TempData["Success"] = $"{successCount} requests approved successfully.";
                        break;
                    case "reject":
                        successCount = await _recyclingRequestService.BulkRejectAsync(requestIds, adminId);
                        TempData["Success"] = $"{successCount} requests rejected successfully.";
                        break;
                    case "delete":
                        successCount = await _recyclingRequestService.BulkDeleteAsync(requestIds);
                        TempData["Success"] = $"{successCount} requests deleted successfully.";
                        break;
                    default:
                        TempData["Error"] = "Invalid action specified.";
                        break;
                }
            }
            catch (Exception ex)
            {
                TempData["Error"] = "An error occurred during bulk action.";
            }

            return RedirectToAction(nameof(Index));
        }
    }
} 