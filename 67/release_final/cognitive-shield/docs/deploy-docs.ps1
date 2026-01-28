# PowerShell script to build and deploy Cognitive Shield docs with MkDocs
# 1. Install mkdocs and mkdocs-material if needed
# 2. Build the static site
# 3. Deploy to GitHub Pages (or output site/ for other hosts)

$docsPath = "c:\MASTER_PROJECT\67\release_final\cognitive-shield\docs"
$sitePath = "$docsPath\site"

Write-Host "Checking for mkdocs..."
if (-not (Get-Command mkdocs -ErrorAction SilentlyContinue)) {
    Write-Host "MkDocs not found. Installing via pip..."
    pip install mkdocs mkdocs-material
}

Write-Host "Building documentation site..."
cd $docsPath
mkdocs build

Write-Host "Documentation built at $sitePath."
Write-Host "To deploy to GitHub Pages, run: mkdocs gh-deploy"
Write-Host "Or upload the 'site' folder to your preferred static host (Vercel, Netlify, etc.)"
