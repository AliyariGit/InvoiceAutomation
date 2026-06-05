using InvoiceApi.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace InvoiceApi.Services;

public class PdfExportService
{
    private static readonly string AccentHex = "#1C396B";

    public byte[] Export(InvoiceDto invoice)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        var doc = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(36);
                page.DefaultTextStyle(x => x.FontSize(10).FontFamily("Arial"));

                page.Header().Element(c => BuildHeader(c, invoice));
                page.Content().Element(c => BuildContent(c, invoice));
                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Generated ").FontSize(8).FontColor(Colors.Grey.Medium);
                    x.Span(DateTime.Now.ToString("yyyy-MM-dd")).FontSize(8).FontColor(Colors.Grey.Medium);
                });
            });
        });

        return doc.GeneratePdf();
    }

    private static void BuildHeader(IContainer container, InvoiceDto invoice)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(col =>
            {
                col.Item().Text("INVOICE").FontSize(22).Bold().FontColor(AccentHex);
                col.Item().Text($"Type: {invoice.InvoiceType}").FontSize(9).FontColor(Colors.Grey.Darken1);
            });

            row.RelativeItem().AlignRight().Column(col =>
            {
                col.Item().Text(text =>
                {
                    text.Span("Invoice # ").Bold();
                    text.Span(invoice.InvoiceNumber);
                });
                col.Item().Text(text =>
                {
                    text.Span("Date: ").Bold();
                    text.Span(invoice.Date.ToString("yyyy-MM-dd"));
                });
                col.Item().Text(text =>
                {
                    text.Span("Due: ").Bold();
                    text.Span(invoice.DueDate.ToString("yyyy-MM-dd"));
                });
            });
        });
    }

    private static void BuildContent(IContainer container, InvoiceDto invoice)
    {
        container.Column(col =>
        {
            col.Spacing(12);

            // Contractor / Client panels
            col.Item().Row(row =>
            {
                row.RelativeItem().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(8).Column(c =>
                {
                    c.Item().Text("FROM").Bold().FontColor(AccentHex);
                    c.Item().Text(invoice.From.Name).Bold();
                    c.Item().Text(invoice.From.Phone);
                    c.Item().Text(invoice.From.Email);
                });

                row.ConstantItem(16);

                row.RelativeItem().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(8).Column(c =>
                {
                    c.Item().Text("TO").Bold().FontColor(AccentHex);
                    c.Item().Text(invoice.To.Name).Bold();
                    c.Item().Text($"Project: {invoice.To.ProjectName}");
                    c.Item().Text(invoice.To.SiteAddress);
                });
            });

            // Line items table
            col.Item().Table(table =>
            {
                var columns = GetColumns(invoice.InvoiceType);
                table.ColumnsDefinition(def =>
                {
                    foreach (var (_, relSize) in columns)
                        def.RelativeColumn(relSize);
                });

                // Header
                table.Header(header =>
                {
                    foreach (var (label, _) in columns)
                    {
                        header.Cell().Background(AccentHex).Padding(5)
                            .Text(label).Bold().FontColor(Colors.White).FontSize(9);
                    }
                });

                // Rows — use TextDescriptor.AlignRight() for numbers; container.AlignRight() shifts relative to page
                bool alt = false;
                foreach (var line in invoice.Lines)
                {
                    var bg = alt ? "#EBF0FA" : (string)Colors.White;
                    var cells = GetCells(line, invoice.InvoiceType);
                    foreach (var (value, alignRight) in cells)
                    {
                        if (alignRight)
                            table.Cell().Background(bg).Padding(4).Text(t => { t.AlignRight(); t.Span(value).FontSize(9); });
                        else
                            table.Cell().Background(bg).Padding(4).Text(value).FontSize(9);
                    }
                    alt = !alt;
                }
            });

            // Totals block — use Row+ConstantItem to avoid AlignRight overflow past right page edge
            decimal subtotal = invoice.Lines.Sum(l => l.Amount);
            decimal tax = subtotal * invoice.TaxRate / 100;
            decimal grand = subtotal + tax;

            col.Item().Row(row =>
            {
                row.RelativeItem();
                row.ConstantItem(230).Table(t =>
                {
                    t.ColumnsDefinition(d => { d.RelativeColumn(3); d.RelativeColumn(2); });

                    t.Cell().PaddingVertical(3).Text("Subtotal").FontSize(9);
                    t.Cell().PaddingVertical(3).Text(tx => { tx.AlignRight(); tx.Span($"{subtotal:N2}").FontSize(9); });

                    t.Cell().PaddingVertical(3).Text($"Tax ({invoice.TaxRate:0.##}%)").FontSize(9);
                    t.Cell().PaddingVertical(3).Text(tx => { tx.AlignRight(); tx.Span($"{tax:N2}").FontSize(9); });

                    t.Cell().Background(AccentHex).Padding(5).Text("GRAND TOTAL").Bold().FontColor(Colors.White).FontSize(10);
                    t.Cell().Background(AccentHex).Padding(5).Text(tx => { tx.AlignRight(); tx.Span($"{grand:N2}").Bold().FontColor(Colors.White).FontSize(10); });
                });
            });

            // Notes
            if (!string.IsNullOrWhiteSpace(invoice.Notes))
            {
                col.Item().Border(1).BorderColor(Colors.Grey.Lighten2).Padding(8).Column(c =>
                {
                    c.Item().Text("Notes / Payment Terms").Bold().FontColor(AccentHex);
                    c.Item().Text(invoice.Notes);
                });
            }
        });
    }

    private static (string label, float relSize)[] GetColumns(string invoiceType) => invoiceType switch
    {
        "LaborOnly" => [("Description", 3f), ("Worker", 2f), ("Hours", 1f), ("Rate/hr", 1f), ("Amount", 1f)],
        "MaterialsOnly" => [("Item", 3f), ("Supplier", 2f), ("Qty", 1f), ("Unit Price", 1f), ("Amount", 1f)],
        "Combined" => [("Description", 3f), ("Type", 1.5f), ("Qty", 1f), ("Rate", 1f), ("Amount", 1f)],
        "FixedPrice" => [("Project Description", 4f), ("Amount", 1f)],
        "UnitPrice" => [("Description", 3f), ("Unit", 1f), ("Qty", 1f), ("Price/unit", 1f), ("Amount", 1f)],
        "HourlyDaily" => [("Description", 3f), ("Worker", 2f), ("Days", 1f), ("Rate/day", 1f), ("Amount", 1f)],
        _ => [("Description", 3f), ("Qty", 1f), ("Rate", 1f), ("Amount", 1f)]
    };

    private static (string value, bool alignRight)[] GetCells(LineItemDto line, string invoiceType) => invoiceType switch
    {
        "LaborOnly" => [(line.Description, false), (line.Worker ?? "", false), ($"{line.Qty:N2}", true), ($"{line.Rate:N2}", true), ($"{line.Amount:N2}", true)],
        "MaterialsOnly" => [(line.Description, false), (line.Supplier ?? "", false), ($"{line.Qty:N2}", true), ($"{line.Rate:N2}", true), ($"{line.Amount:N2}", true)],
        "Combined" => [(line.Description, false), (line.Type ?? "", false), ($"{line.Qty:N2}", true), ($"{line.Rate:N2}", true), ($"{line.Amount:N2}", true)],
        "FixedPrice" => [(line.Description, false), ($"{line.Amount:N2}", true)],
        "UnitPrice" => [(line.Description, false), (line.Unit ?? "", false), ($"{line.Qty:N2}", true), ($"{line.Rate:N2}", true), ($"{line.Amount:N2}", true)],
        "HourlyDaily" => [(line.Description, false), (line.Worker ?? "", false), ($"{line.Qty:N2}", true), ($"{line.Rate:N2}", true), ($"{line.Amount:N2}", true)],
        _ => [(line.Description, false), ($"{line.Qty:N2}", true), ($"{line.Rate:N2}", true), ($"{line.Amount:N2}", true)]
    };
}
