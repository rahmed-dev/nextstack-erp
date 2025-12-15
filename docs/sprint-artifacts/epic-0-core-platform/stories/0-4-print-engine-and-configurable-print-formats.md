# Story 0.4: Print Engine and Configurable Print Formats

Story Key: 0-4-print-engine-and-configurable-print-formats  
Epic: 0 - Core Platform  
Status: ready-for-dev

## Story

As a developer, I want a standard print engine with configurable print formats (DocType-driven) so any document can be rendered to print/PDF consistently without bespoke renderers or status changes.

## Acceptance Criteria

1. **DocType-driven print templates**  
   - Given a DocType defines fields and child tables  
   - When a print format is configured for it  
   - Then the print engine renders header/lines/totals/metadata correctly using placeholders/mappings.
2. **Configurable formats**  
   - Given multiple print formats exist for a DocType  
   - When a format is selected (default/alternate)  
   - Then output uses that format (branding/layout) with correct data bindings.
3. **No lifecycle impact**  
   - Given a document is printed/exported  
   - When the print action completes  
   - Then the document status remains unchanged; printing is presentational.
4. **Reusable across DocTypes**  
   - Given other DocTypes need printing later (invoices, payments, GL reports, etc.)  
   - When they call the print engine  
   - Then they reuse the same engine and format system; no bespoke per-DocType renderer.

## Tasks / Subtasks

- [ ] Implement core print engine under `src/core/print` that accepts DocType schema + print format template and outputs HTML/PDF.
- [ ] Define print format schema (placeholders, child table loops, branding/headers/footers, currency/number formatting).
- [ ] Add default and sample alternate print formats for invoices as reference; document how to add formats for any DocType.
- [ ] Expose print/export API/hook for UI (print/preview/export) that does not change document status; optional audit of print actions.
- [ ] Wire shared UI components/actions for print/format selection (list/detail) consuming the print engine.
- [ ] Ensure offline generation (local PDF/HTML) with no network dependency.

## Developer Context

- Aligns with architecture call for DocType-agnostic print/export engine; prevents bespoke printing.
- First consumer: invoices (1-3/1-4); reusable for other DocTypes later.
- Depends on core audit (optional log), shared listing/actions, DocType metadata.

## Technical Requirements

- Engine: template renderer supporting placeholders, loops for child tables, conditional blocks, number/currency formatting, headers/footers.
- Formats: stored as config files (e.g., `src/modules/<module>/print-formats/<doctype>/`); support default/alt selection; versionable.
- Output: HTML for preview; PDF export locally; no status mutation.
- UI integration: shared print action component; format selector; error handling via `{ data, error }`.
- Audit: optional log of print/export actions (toggle).
- Offline: fully local rendering/export.

## Architecture Compliance

- DocType-first; no bespoke per-DocType renderers; shared engine.
- Shared UI actions; `{ data, error }` envelope; no status change on print.

## Library / Framework Requirements

- React + TypeScript + Tauri; local HTML→PDF (e.g., using existing toolchain in Tauri); no network.

### Library Dependencies

**Required:**
- `handlebars`: ^4.7.x - Template engine for print formats
- `@react-pdf/renderer`: ^3.x - PDF generation from React components
- `date-fns`: ^2.x or ^3.x - Date formatting in templates
- `numeral`: ^2.x - Number and currency formatting

**Library Rationale:**

**Handlebars.js (^4.7.x):**
- Industry-standard templating with minimal learning curve
- Supports helpers for formatting (currency, dates, conditionals)
- Safe by default (auto-escaping prevents XSS)
- Custom helpers for business logic (tax calculations, totals)
- Template precompilation for performance

**@react-pdf/renderer (^3.x):**
- React-based PDF generation (fits existing stack)
- Declarative component API
- Full styling support (flexbox, fonts, colors)
- Offline rendering (no browser print dialogs)
- Supports custom fonts and images

**Alternative Considered:**
- `pdfmake` - Rejected: Imperative API, less maintainable
- `jsPDF` - Rejected: Canvas-based, limited layout flexibility
- Browser print API - Rejected: Inconsistent rendering, requires user interaction

### Template Engine Configuration

**Handlebars Setup:**
```typescript
// src/core/print/handlebars-config.ts
import Handlebars from 'handlebars'
import numeral from 'numeral'
import { format } from 'date-fns'

// Register custom helpers
Handlebars.registerHelper('currency', (value: number) => {
  return numeral(value).format('$0,0.00')
})

Handlebars.registerHelper('date', (value: string | number, formatStr: string) => {
  return format(new Date(value), formatStr || 'MMM dd, yyyy')
})

Handlebars.registerHelper('percent', (value: number) => {
  return numeral(value / 100).format('0.00%')
})

Handlebars.registerHelper('eq', (a, b) => a === b)
Handlebars.registerHelper('gt', (a, b) => a > b)
Handlebars.registerHelper('lt', (a, b) => a < b)

export default Handlebars
```

**Template Example:**
```handlebars
<!-- Invoice Default Format -->
<div class="invoice">
  <h1>Invoice {{name}}</h1>
  <p>Date: {{date posting_date "MMM dd, yyyy"}}</p>
  <p>Customer: {{customer_name}}</p>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Rate</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {{#each items}}
      <tr>
        <td>{{item_name}}</td>
        <td>{{qty}}</td>
        <td>{{currency rate}}</td>
        <td>{{currency amount}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <div class="totals">
    <p>Subtotal: {{currency subtotal}}</p>
    {{#if tax_amount}}
    <p>Tax ({{percent tax_rate}}): {{currency tax_amount}}</p>
    {{/if}}
    <p><strong>Total: {{currency grand_total}}</strong></p>
  </div>
</div>
```

### PrintFormat Schema and Storage

**PrintFormat Schema:**
```typescript
interface PrintFormat {
  name: string              // Unique identifier: "invoice-default"
  doctype: string           // Target DocType: "SalesInvoice"
  label: string             // Display name: "Default Invoice Format"
  is_default: boolean       // Primary format for DocType
  template_type: 'handlebars' | 'react-pdf'  // Template engine
  template: string          // Handlebars template string OR React component path
  styles?: string           // CSS for HTML templates
  metadata: {
    page_size: 'A4' | 'Letter'
    orientation: 'portrait' | 'landscape'
    margins: { top: number; right: number; bottom: number; left: number }
    show_header: boolean
    show_footer: boolean
    watermark?: string
  }
  created_at: number
  modified_at: number
}
```

**Storage Structure:**
```
src/modules/accounting/print-formats/
  sales-invoice/
    default.ts              # Default format export
    detailed.ts             # Alternate format
    compact.ts              # Alternate format
  purchase-invoice/
    default.ts
  payment/
    default.ts
    receipt.ts

# Format file structure (default.ts)
export const format: PrintFormat = {
  name: 'invoice-default',
  doctype: 'SalesInvoice',
  label: 'Default Invoice',
  is_default: true,
  template_type: 'handlebars',
  template: `...handlebars template...`,
  styles: `...css...`,
  metadata: {
    page_size: 'A4',
    orientation: 'portrait',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    show_header: true,
    show_footer: true
  }
}
```

**Format Registry (Runtime):**
```typescript
// src/core/print/format-registry.ts
class PrintFormatRegistry {
  private formats: Map<string, PrintFormat[]> = new Map()

  register(format: PrintFormat) {
    if (!this.formats.has(format.doctype)) {
      this.formats.set(format.doctype, [])
    }
    this.formats.get(format.doctype)!.push(format)
  }

  getDefault(doctype: string): PrintFormat | null {
    const formats = this.formats.get(doctype) || []
    return formats.find(f => f.is_default) || formats[0] || null
  }

  getFormat(doctype: string, formatName: string): PrintFormat | null {
    const formats = this.formats.get(doctype) || []
    return formats.find(f => f.name === formatName) || null
  }

  listFormats(doctype: string): PrintFormat[] {
    return this.formats.get(doctype) || []
  }
}

export const formatRegistry = new PrintFormatRegistry()
```

### DocType Metadata for Print Formats

**DocType Schema Extension:**
```typescript
interface DocType {
  name: string
  label: string
  fields: Field[]

  // Print engine metadata
  print_formats?: string[]  // List of registered format names
  default_print_format?: string  // Default format name

  // Other metadata (from previous stories)
  is_submittable: boolean
  audit_enabled: boolean
  // ...
}
```

**Example: Sales Invoice DocType**
```typescript
const SalesInvoiceDocType: DocType = {
  name: 'SalesInvoice',
  label: 'Sales Invoice',
  is_submittable: true,
  audit_enabled: true,

  // Print configuration
  print_formats: ['invoice-default', 'invoice-detailed', 'invoice-compact'],
  default_print_format: 'invoice-default',

  fields: [
    { name: 'name', type: 'string', required: true },
    { name: 'customer_name', type: 'string', required: true },
    { name: 'posting_date', type: 'date', required: true },
    { name: 'items', type: 'table', required: true },
    { name: 'subtotal', type: 'currency' },
    { name: 'tax_amount', type: 'currency' },
    { name: 'grand_total', type: 'currency' },
    // ...
  ]
}
```

**Format Registration (App Initialization):**
```typescript
// src/main.tsx or app initialization
import { formatRegistry } from '@/core/print/format-registry'
import { format as invoiceDefault } from '@/modules/accounting/print-formats/sales-invoice/default'
import { format as invoiceDetailed } from '@/modules/accounting/print-formats/sales-invoice/detailed'

// Register all formats at app startup
formatRegistry.register(invoiceDefault)
formatRegistry.register(invoiceDetailed)
// ... register other formats
```

### Error Handling for Rendering and PDF Generation

**Template Rendering Errors:**
```typescript
// src/core/print/renderer.ts
export async function renderTemplate(
  format: PrintFormat,
  document: any
): Promise<{ data: string | null; error: Error | null }> {
  try {
    // 1. Validate template exists
    if (!format.template) {
      throw new PrintError('Template is empty or missing', 'MISSING_TEMPLATE')
    }

    // 2. Compile template
    let compiledTemplate
    try {
      compiledTemplate = Handlebars.compile(format.template)
    } catch (err) {
      throw new PrintError(
        `Template compilation failed: ${err.message}`,
        'TEMPLATE_SYNTAX_ERROR',
        { originalError: err }
      )
    }

    // 3. Render with document data
    let html
    try {
      html = compiledTemplate(document)
    } catch (err) {
      throw new PrintError(
        `Template rendering failed: ${err.message}`,
        'RENDER_ERROR',
        { originalError: err, document }
      )
    }

    // 4. Validate output
    if (!html || html.trim().length === 0) {
      throw new PrintError('Rendered output is empty', 'EMPTY_OUTPUT')
    }

    return { data: html, error: null }

  } catch (error) {
    console.error('[Print] Template rendering error:', error)
    return {
      data: null,
      error: error instanceof PrintError ? error : new PrintError(
        'Unknown rendering error',
        'UNKNOWN_ERROR',
        { originalError: error }
      )
    }
  }
}
```

**PDF Generation Errors:**
```typescript
// src/core/print/pdf-generator.ts
import { pdf } from '@react-pdf/renderer'

export async function generatePDF(
  format: PrintFormat,
  document: any
): Promise<{ data: Blob | null; error: Error | null }> {
  try {
    // 1. Render React PDF component
    let reactPdfDocument
    try {
      reactPdfDocument = renderReactPDFComponent(format, document)
    } catch (err) {
      throw new PrintError(
        `React PDF component error: ${err.message}`,
        'COMPONENT_ERROR',
        { originalError: err }
      )
    }

    // 2. Generate PDF blob
    let blob
    try {
      const pdfInstance = pdf(reactPdfDocument)
      blob = await pdfInstance.toBlob()
    } catch (err) {
      throw new PrintError(
        `PDF generation failed: ${err.message}`,
        'PDF_GENERATION_ERROR',
        { originalError: err }
      )
    }

    // 3. Validate blob
    if (!blob || blob.size === 0) {
      throw new PrintError('Generated PDF is empty', 'EMPTY_PDF')
    }

    return { data: blob, error: null }

  } catch (error) {
    console.error('[Print] PDF generation error:', error)
    return {
      data: null,
      error: error instanceof PrintError ? error : new PrintError(
        'Unknown PDF error',
        'UNKNOWN_ERROR',
        { originalError: error }
      )
    }
  }
}
```

**Custom Error Class:**
```typescript
class PrintError extends Error {
  code: string
  context?: any

  constructor(message: string, code: string, context?: any) {
    super(message)
    this.name = 'PrintError'
    this.code = code
    this.context = context
  }
}
```

**User-Facing Error Messages:**
```typescript
const errorMessages = {
  MISSING_TEMPLATE: 'Print format template is missing. Please contact support.',
  TEMPLATE_SYNTAX_ERROR: 'Print format has invalid syntax. Please contact support.',
  RENDER_ERROR: 'Failed to generate print preview. Check document data.',
  EMPTY_OUTPUT: 'Print preview is empty. Document may be missing required fields.',
  COMPONENT_ERROR: 'Failed to render PDF component. Please try again.',
  PDF_GENERATION_ERROR: 'Failed to generate PDF. Please try again or use HTML preview.',
  EMPTY_PDF: 'Generated PDF is empty. Document may be invalid.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
}

// Error display in UI
function displayPrintError(error: PrintError) {
  const userMessage = errorMessages[error.code] || errorMessages.UNKNOWN_ERROR
  toast.error(userMessage)

  // Log full error for debugging
  console.error('[Print Error]', {
    code: error.code,
    message: error.message,
    context: error.context
  })
}
```

**Graceful Degradation:**
```typescript
// src/ui/components/print/PrintAction.tsx
async function handlePrint(document: any, formatName?: string) {
  // 1. Try PDF generation first
  const pdfResult = await generatePDF(format, document)

  if (pdfResult.error) {
    // 2. Fallback to HTML preview on PDF error
    console.warn('[Print] PDF failed, falling back to HTML:', pdfResult.error)

    const htmlResult = await renderTemplate(format, document)

    if (htmlResult.error) {
      // 3. Both failed - show error
      displayPrintError(htmlResult.error)
      return
    }

    // Show HTML preview in new window
    showHTMLPreview(htmlResult.data!)
    return
  }

  // Success - download PDF
  downloadBlob(pdfResult.data!, `${document.name}.pdf`)
}
```

## File Structure Requirements

- Core engine: `src/core/print/` (renderer, format parser, helpers).
- Formats: `src/modules/accounting/print-formats/invoice/default.ts` (plus alt) as reference; extensible for other DocTypes.
- API: `src/modules/accounting/api/print.ts` (or core print API) exposing print/preview/export.
- UI: shared print action component in `src/ui/components/print/`; invoice screens consume it.
- Tests: engine unit tests (template resolution, child tables, currency formatting), format loading, UI action wiring.

## Testing Requirements

- Unit: template rendering with placeholders/loops; currency/number formatting; default/alt format selection; no status mutation.
- Integration: invoice print/preview/export via engine works offline; error surfaced via `{ data, error }`; audit optional.
- Regression: adding new DocType formats requires no engine changes; printing other DocTypes reuses engine.

## Project Context Reference

- Source docs: project-context.md, architecture docs (print/export), Epic 1 invoices as first consumer, core platform stories 0-1/0-2/0-3.

## Dev Agent Record

- Agent Model Used: SM agent (yolo) via Codex CLI.  
- Debug Log References: none.  
- Completion Notes List: Core print engine story; no external web content beyond prior npm version checks.  
- File List: `docs/sprint-artifacts/epic-0-core-platform/stories/0-4-print-engine-and-configurable-print-formats.md`.

## Story Completion Status

- Status: ready-for-dev  
- Story ID: 0.4  
- Story Key: 0-4-print-engine-and-configurable-print-formats  
- File: docs/sprint-artifacts/epic-0-core-platform/stories/0-4-print-engine-and-configurable-print-formats.md  
- Notes: Required to avoid bespoke print implementations; first consumer invoices.
