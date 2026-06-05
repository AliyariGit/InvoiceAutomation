namespace InvoiceApi.Models;

public class InvoiceDto
{
    public string InvoiceNumber { get; set; } = "";
    public DateTime Date { get; set; }
    public DateTime DueDate { get; set; }
    public string InvoiceType { get; set; } = "";
    public ContractorInfo From { get; set; } = new();
    public ClientInfo To { get; set; } = new();
    public List<LineItemDto> Lines { get; set; } = [];
    public decimal TaxRate { get; set; }
    public string Notes { get; set; } = "";
}

public class ContractorInfo
{
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Email { get; set; } = "";
}

public class ClientInfo
{
    public string Name { get; set; } = "";
    public string ProjectName { get; set; } = "";
    public string SiteAddress { get; set; } = "";
}

public class LineItemDto
{
    public string Description { get; set; } = "";
    public string? Worker { get; set; }
    public string? Supplier { get; set; }
    public string? Unit { get; set; }
    public string? Type { get; set; }
    public decimal Qty { get; set; }
    public decimal Rate { get; set; }
    public decimal Amount { get; set; }
}
