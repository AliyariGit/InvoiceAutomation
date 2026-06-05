using InvoiceApi.Models;
using InvoiceApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceApi.Controllers;

[ApiController]
[Route("api/invoice")]
public class InvoiceController(ExcelExportService excel, PdfExportService pdf) : ControllerBase
{
    [HttpPost("export/excel")]
    public IActionResult ExportExcel([FromBody] InvoiceDto invoice)
    {
        var bytes = excel.Export(invoice);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"Invoice_{invoice.InvoiceNumber}.xlsx");
    }

    [HttpPost("export/pdf")]
    public IActionResult ExportPdf([FromBody] InvoiceDto invoice)
    {
        var bytes = pdf.Export(invoice);
        return File(bytes, "application/pdf", $"Invoice_{invoice.InvoiceNumber}.pdf");
    }
}
