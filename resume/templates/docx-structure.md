# Word (.docx) structure

Some application portals accept only `.doc`/`.docx`, and some recruiters edit
your resume before forwarding it internally — usually to add their agency's
header. This is the document they should get.

## How to produce it

The build emits `exports/ATS-Resume.doc.html`. Word opens HTML natively.

1. Open `exports/ATS-Resume.doc.html` in Microsoft Word
   (right-click → Open With → Word — do not double-click, that opens a browser).
2. **File → Save As → Word Document (\*.docx)**.
3. Save into `exports/` as `ATS-Resume.docx`.

That is the whole process. It takes about fifteen seconds and it is repeatable
after every content change.

### Why not generate the .docx directly

A `.docx` is a ZIP of XML parts. Writing one without a library is possible, and
libraries that do it well exist — but both routes produce a binary that cannot
be diffed in git, and both emit *direct formatting* rather than named styles.
Direct formatting is the reason so many resumes become unfixable the moment a
recruiter changes the font: every paragraph carries its own overrides, so there
is no single place to edit.

The HTML route hands Word real named styles it already understands, and keeps
the source file readable in version control. The one manual step buys a document
that is actually editable afterwards.

## Style map

Word maps the HTML tags to its own built-in styles. Adjusting any of these once
in Word's Styles pane restyles every instance — which is the point.

| Element                | Word style   | Font            | Size   | Treatment                          |
| ---------------------- | ------------ | --------------- | ------ | ---------------------------------- |
| Name                   | Heading 1    | Calibri         | 22 pt  | Tight tracking, no colour          |
| Section heading        | Heading 2    | Calibri         | 11 pt  | Uppercase, letterspaced, rule under |
| Role / project name    | Heading 3    | Calibri         | 10.5 pt| Semibold                           |
| Body copy              | Normal       | Calibri         | 10 pt  | 1.42 line spacing                  |
| Bullets                | List Paragraph | Calibri       | 10 pt  | Single level only                  |
| Divider                | —            | —               | —      | 1 pt rule, full width              |

### Why Calibri and not the portfolio's typefaces

The premium PDF embeds Bricolage Grotesque, Inter, Instrument Serif and JetBrains
Mono, so it looks identical everywhere. Word's HTML importer does not reliably
embed webfonts, and a `.docx` that references a font the recipient lacks
substitutes it silently — usually to Times New Roman, and usually at a different
metric, which reflows the whole document.

Calibri and Segoe UI ship with every Office install on Windows and macOS. A
resume that renders as intended on the recruiter's machine beats one that renders
beautifully on yours.

## Rules this document keeps

These are the same constraints the ATS markdown follows, and they matter more in
Word than anywhere else, because Word makes it so easy to break them:

- **No text boxes.** Parsers skip them entirely. A name in a text box is a resume
  with no name.
- **No tables**, including invisible ones used for layout. Cell reading order is
  not what it looks like.
- **No headers or footers.** Several parsers never read them. Contact details go
  in the body.
- **No images**, including a headshot. Most international employers do not want
  one, several jurisdictions advise against it, and no parser can read it.
- **One column.** Word's column feature interleaves text on extraction.
- **Standard bullets only.** A custom glyph can come out as `` in plain text.

## After saving

Open the `.docx`, select all, and copy into a plain text editor. What you see is
approximately what a parser sees. If the order is wrong or something is missing,
the layout is at fault — not the parser.
