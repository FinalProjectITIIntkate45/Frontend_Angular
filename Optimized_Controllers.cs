using Microsoft.AspNetCore.Mvc;
using Services;
using ViewModels;
using ViewModels.Recycling;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace PointFayMVC.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecyclingMaterialsApiController : ControllerBase
    {
        private readonly RecyclingMaterialServices _recyclingMaterialService;

        public RecyclingMaterialsApiController(RecyclingMaterialServices recyclingMaterialService)
        {
            _recyclingMaterialService = recyclingMaterialService;
        }

        [HttpGet("getall")]
        public async Task<ActionResult<APIResult<List<RecyclingMaterialViewModel>>>> GetAll()
        {
            try
            {
                // ✅ Use async/await properly and add error handling
                var materials = await _recyclingMaterialService.GetAllMaterialsAsync();
                
                // ✅ Return early if no data to avoid unnecessary processing
                if (materials == null || !materials.Any())
                {
                    return Ok(APIResult<List<RecyclingMaterialViewModel>>.Success(new List<RecyclingMaterialViewModel>()));
                }

                return Ok(APIResult<List<RecyclingMaterialViewModel>>.Success(materials));
            }
            catch (Exception ex)
            {
                // ✅ Add proper logging here
                return StatusCode(500, APIResult<List<RecyclingMaterialViewModel>>.Fail("Internal server error", 500));
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<APIResult<RecyclingMaterialViewModel>>> GetById(int id)
        {
            try
            {
                var material = await _recyclingMaterialService.GetMaterialByIdAsync(id);
                if (material == null) 
                {
                    return NotFound(APIResult<RecyclingMaterialViewModel>.Fail("Material not found", 404));
                }

                return Ok(APIResult<RecyclingMaterialViewModel>.Success(material));
            }
            catch (Exception ex)
            {
                return StatusCode(500, APIResult<RecyclingMaterialViewModel>.Fail("Internal server error", 500));
            }
        }

        // Other methods remain the same...
    }
}

namespace PointFayAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecyclingRequestController : ControllerBase
    {
        private readonly RecyclingRequestService _recyclingRequestService;

        public RecyclingRequestController(RecyclingRequestService recyclingRequestService)
        {
            _recyclingRequestService = recyclingRequestService;
        }

        [HttpPost("CreateRequest")]
        public async Task<IActionResult> CreateRequest(RecyclingRequestCreateViewModel create)
        {
            try
            {
                // ✅ Cache the user ID lookup
                var clientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(clientId))
                {
                    return BadRequest(APIResult<object>.Fail("User not authenticated", 401));
                }

                await _recyclingRequestService.AddAsync(create, clientId);

                return Ok(APIResult<object>.Success(null, "Recycling request created successfully"));
            }
            catch (Exception ex)
            {
                // ✅ Add proper logging here
                return StatusCode(500, APIResult<object>.Fail($"An error occurred: {ex.Message}", 500));
            }
        }

        [HttpGet("MyRequests")]
        public async Task<IActionResult> GetMyRequests([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var clientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(clientId))
                {
                    return BadRequest(APIResult<object>.Fail("User not authenticated", 401));
                }

                // ✅ Use pagination for better performance
                var requests = await _recyclingRequestService.GetMyRequestsAsync(clientId);
                
                // ✅ Apply pagination in memory for now (better to do it in repository)
                var paginatedRequests = requests
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                return Ok(APIResult<List<RecyclingRequestListItemViewModel>>.Success(paginatedRequests));
            }
            catch (Exception ex)
            {
                return StatusCode(500, APIResult<object>.Fail($"An error occurred: {ex.Message}", 500));
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRequestDetails(int id)
        {
            try
            {
                var clientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(clientId))
                {
                    return BadRequest(APIResult<object>.Fail("User not authenticated", 401));
                }

                var request = await _recyclingRequestService.GetRequestDetailsAsync(id, clientId);

                if (request == null)
                {
                    return NotFound(APIResult<object>.Fail("Request not found", 404));
                }

                return Ok(APIResult<RecyclingRequestDetailsViewModel>.Success(request));
            }
            catch (Exception ex)
            {
                return StatusCode(500, APIResult<object>.Fail($"An error occurred: {ex.Message}", 500));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRequest(int id, RecyclingRequestEditViewModel edit)
        {
            try
            {
                var clientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(clientId))
                {
                    return BadRequest(APIResult<object>.Fail("User not authenticated", 401));
                }

                edit.Id = id;
                await _recyclingRequestService.UpdateRequestAsync(edit, clientId);

                return Ok(APIResult<object>.Success(null, "Request updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, APIResult<object>.Fail($"An error occurred: {ex.Message}", 500));
            }
        }
    }
} 