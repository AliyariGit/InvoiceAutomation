using InvoiceApi.Models;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;

namespace InvoiceApi.Services;

public class ExcelExportService
{
    public byte[] Export(InvoiceDto invoice)
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        using var package = new ExcelPackage();
        var ws = package.Workbook.Worksheets.Add("Invoice");

        var col1 = Color.FromArgb(28, 57, 107);
        var colAlt = Color.FromArgb(235, 240, 250);

        var headers = GetColumnHeaders(invoice.InvoiceType);
        int totalCols = headers.Length;
        int row = 1;

        // Title row
        ws.Cells[row, 1].Value = "INVOICE";
        ws.Cells[row, 1, row, totalCols].Merge = true;
        ws.Cells[row, 1].Style.Font.Bold = true;
        ws.Cells[row, 1].Style.Font.Size = 18;
        ws.Cells[row, 1].Style.Font.Color.SetColor(col1);
        row++;

        // Invoice meta
        ws.Cells[row, 1].Value = "Invoice #:";
        ws.Cells[row, 2].Value = invoice.InvoiceNumber;
        ws.Cells[row, 4].Value = "Date:";
        ws.Cells[row, 5].Value = invoice.Date.ToString("yyyy-MM-dd");
        row++;
        ws.Cells[row, 1].Value = "Type:";
        ws.Cells[row, 2].Value = invoice.InvoiceType;
        ws.Cells[row, 4].Value = "Due Date:";
        ws.Cells[row, 5].Value = invoice.DueDate.ToString("yyyy-MM-dd");
        row += 2;

        // From / To headers
        ws.Cells[row, 1].Value = "FROM";
        ws.Cells[row, 4].Value = "TO";
        StyleHeader(ws.Cells[row, 1], col1);
        StyleHeader(ws.Cells[row, 4], col1);
        row++;

        ws.Cells[row, 1].Value = invoice.From.Name;
        ws.Cells[row, 4].Value = invoice.To.Name;
        row++;
        ws.Cells[row, 1].Value = invoice.From.Phone;
        ws.Cells[row, 4].Value = invoice.To.ProjectName;
        row++;
        ws.Cells[row, 1].Value = invoice.From.Email;
        ws.Cells[row, 4].Value = invoice.To.SiteAddress;
        row += 2;

        // Column headers
        for (int c = 0; c < headers.Length; c++)
        {
            ws.Cells[row, c + 1].Value = headers[c];
            ws.Cells[row, c + 1].Style.Font.Bold = true;
            ws.Cells[row, c + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
            ws.Cells[row, c + 1].Style.Fill.BackgroundColor.SetColor(col1);
            ws.Cells[row, c + 1].Style.Font.Color.SetColor(Color.White);
        }
        ws.View.FreezePanes(row + 1, 1);
        row++;

        // Line items
        bool alt = false;
        foreach (var line in invoice.Lines)
        {
            var cells = GetLineValues(line, invoice.InvoiceType);
            for (int c = 0; c < cells.Length; c++)
            {
                ws.Cells[row, c + 1].Value = cells[c];
                if (cells[c] is decimal)
                    ws.Cells[row, c + 1].Style.Numberformat.Format = "#,##0.00";
                if (alt)
                {
                    ws.Cells[row, c + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                    ws.Cells[row, c + 1].Style.Fill.BackgroundColor.SetColor(colAlt);
                }
            }
            alt = !alt;
            row++;
        }

        row++;
        decimal subtotal = invoice.Lines.Sum(l => l.Amount);
        decimal tax = subtotal * invoice.TaxRate / 100;
        decimal grand = subtotal + tax;

        int labelCol = Math.Max(1, totalCols - 1);
        int valueCol = totalCols;

        WriteTotalRow(ws, row++, "Subtotal", subtotal, labelCol, valueCol);
        WriteTotalRow(ws, row++, $"Tax ({invoice.TaxRate:0.##}%)", tax, labelCol, valueCol);
        ws.Cells[row, labelCol].Value = "GRAND TOTAL";
        ws.Cells[row, valueCol].Value = grand;
        ws.Cells[row, valueCol].Style.Numberformat.Format = "#,##0.00";
        foreach (var c in new[] { ws.Cells[row, labelCol], ws.Cells[row, valueCol] })
        {
            c.Style.Font.Bold = true;
            c.Style.Font.Size = 12;
            c.Style.Fill.PatternType = ExcelFillStyle.Solid;
            c.Style.Fill.BackgroundColor.SetColor(col1);
            c.Style.Font.Color.SetColor(Color.White);
        }
        row += 2;

        if (!string.IsNullOrWhiteSpace(invoice.Notes))
        {
            ws.Cells[row, 1].Value = "Notes / Payment Terms:";
            ws.Cells[row, 1].Style.Font.Bold = true;
            row++;
            ws.Cells[row, 1].Value = invoice.Notes;
            ws.Cells[row, 1, row, totalCols].Merge = true;
            ws.Cells[row, 1].Style.WrapText = true;
            ws.Row(row).Height = 45;
        }

        ws.Cells[ws.Dimension.Address].AutoFitColumns();
        return package.GetAsByteArray();
    }

    private static string[] GetColumnHeaders(string invoiceType) => invoiceType switch
    {
        "LaborOnly" => ["Description", "Worker", "Hours", "Rate/hr", "Amount"],
        "MaterialsOnly" => ["Item", "Supplier", "Qty", "Unit Price", "Amount"],
        "Combined" => ["Description", "Type", "Qty", "Rate", "Amount"],
        "FixedPrice" => ["Project Description", "Amount"],
        "UnitPrice" => ["Description", "Unit", "Qty", "Price/unit", "Amount"],
        "HourlyDaily" => ["Description", "Worker", "Days", "Rate/day", "Amount"],
        _ => ["Description", "Qty", "Rate", "Amount"]
    };

    private static object[] GetLineValues(LineItemDto line, string invoiceType) => invoiceType switch
    {
        "LaborOnly" => [line.Description, line.Worker ?? "", line.Qty, line.Rate, line.Amount],
        "MaterialsOnly" => [line.Description, line.Supplier ?? "", line.Qty, line.Rate, line.Amount],
        "Combined" => [line.Description, line.Type ?? "", line.Qty, line.Rate, line.Amount],
        "FixedPrice" => [line.Description, line.Amount],
        "UnitPrice" => [line.Description, line.Unit ?? "", line.Qty, line.Rate, line.Amount],
        "HourlyDaily" => [line.Description, line.Worker ?? "", line.Qty, line.Rate, line.Amount],
        _ => [line.Description, line.Qty, line.Rate, line.Amount]
    };

    private static void StyleHeader(ExcelRange cell, Color color)
    {
        cell.Style.Font.Bold = true;
        cell.Style.Font.Color.SetColor(color);
        cell.Style.Font.Size = 11;
    }

    private static void WriteTotalRow(ExcelWorksheet ws, int row, string label, decimal value, int labelCol, int valueCol)
    {
        ws.Cells[row, labelCol].Value = label;
        ws.Cells[row, valueCol].Value = value;
        ws.Cells[row, valueCol].Style.Numberformat.Format = "#,##0.00";
    }
}
