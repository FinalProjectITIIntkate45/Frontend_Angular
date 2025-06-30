using Models.Enums;

namespace ViewModels.Recycling
{
    public class RecyclingRequestStatisticsViewModel
    {
        public int TotalRequests { get; set; }
        public int PendingRequests { get; set; }
        public int ApprovedRequests { get; set; }
        public int RejectedRequests { get; set; }
        public int CompletedRequests { get; set; }
        public int TotalPointsAwarded { get; set; }
        public double AverageProcessingTime { get; set; }
        public List<TopMaterialViewModel> TopMaterials { get; set; } = new();
        public List<MonthlyStatViewModel> MonthlyStats { get; set; } = new();
    }

    public class TopMaterialViewModel
    {
        public string Name { get; set; } = "";
        public int Count { get; set; }
        public double Percentage => Count > 0 ? (double)Count / 100 : 0;
    }

    public class MonthlyStatViewModel
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Count { get; set; }
        public int Points { get; set; }
        public string MonthName => new DateTime(Year, Month, 1).ToString("MMM yyyy");
    }
} 