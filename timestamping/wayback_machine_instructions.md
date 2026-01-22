# Wayback Machine Archive Instructions

**Service:** Internet Archive Wayback Machine
**URL:** https://archive.org/web
**Cost:** Free
**Method:** Web page preservation
**Timeline:** Immediate capture, confirmation within minutes

## Prerequisites

1. **Published URLs:** All publication URLs must be live and accessible
2. **Web Browser:** Modern browser with JavaScript enabled
3. **Screenshot Tool:** For documentation purposes

## Target URLs for Archiving

Archive each publication URL immediately after publication:

1. **IP.com:** `https://ip.com/IPCOM/xxxxxxxxx` (replace with actual number)
2. **Prior Art Archive:** `https://priorartarchive.org/[publication-url]`
3. **TDCommons:** `https://tdcommons.org/[publication-url]`
4. **arXiv:** `https://arxiv.org/abs/2601.xxxxx`

## Step-by-Step Process

### 1. Access Wayback Machine
```text
Visit: https://archive.org/web
Navigate: "Save Page Now" section
```

### 2. Submit URL for Archiving
```text
Field: "Enter a URL or upload a file to archive"
Value: [publication URL from list above]
Options:
□ Capture outlinks (recommended)
□ Capture screenshot (recommended)
□ Use mobile user-agent (optional)
□ Skip first archive check (optional)

Click: "Save Page"
```

### 3. Monitor Archival Process
```text
Status: "Saving page..." (initial)
Wait: 30 seconds to 5 minutes
Result: Green checkmark = successful capture
```

### 4. Verify Capture
```text
Click: "Browse History" link
Confirm: Date shows January 20, 2026
Test: Click archived snapshot
Verify: Content loads correctly
```

### 5. Document Evidence
```text
Screenshot: Confirmation page with timestamp
Save: Archive.org URL with timestamp
Download: Archived page for local backup
Record: Wayback Machine ID and access URL
```

## Bulk Archival Script (Optional)

```bash
#!/bin/bash
# Bulk Wayback Machine submission script

URLS=(
    "https://ip.com/IPCOM/xxxxxxxxx"
    "https://priorartarchive.org/[publication-url]"
    "https://tdcommons.org/[publication-url]"
    "https://arxiv.org/abs/2601.xxxxx"
)

for url in "${URLS[@]}"; do
    echo "Archiving: $url"
    curl -X POST "https://web.archive.org/save/$url" \
         -H "Accept: application/json" \
         -d "capture_all=1&capture_screenshot=1"
    sleep 30  # Rate limiting
done
```

## Verification Methods

### Method 1: Wayback Machine Search
```text
Visit: https://archive.org/web
Enter: [publication URL]
Click: "Browse History"
Verify: January 20, 2026 capture exists
```

### Method 2: Direct Archive Access
```text
Format: https://web.archive.org/web/20260120*/[original-url]
Example: https://web.archive.org/web/20260120*/https://arxiv.org/abs/2601.xxxxx
```

### Method 3: CDX API Query
```bash
# Check if URL was archived
curl "http://web.archive.org/cdx/search/cdx?url=[original-url]&from=20260120&to=20260121"
```

## Legal Recognition

- **EPO Acceptance:** T 0286/10 decision accepts Wayback timestamps
- **U.S. Courts:** Admitted when authenticated by Internet Archive affidavit
- **Burden of Proof:** Preservation creates "sufficient presumption" of availability
- **Timestamp Accuracy:** Exact archival time recorded

## Evidence Collection

### Required Screenshots:
1. **Submission Confirmation:** Green checkmark with timestamp
2. **Archive Listing:** January 20, 2026 entry in history
3. **Archived Content:** Verify PDF loads and displays correctly
4. **URL Structure:** Document Wayback Machine access URL

### Documentation Template:
```
Wayback Machine Evidence for [Publication Name]
===============================================

Original URL: [full publication URL]
Archived URL: https://web.archive.org/web/20260120[time]/[original-url]
Archive Date: January 20, 2026
Archive Time: [exact timestamp from confirmation]
Confirmation Screenshot: wayback_[publication]_[timestamp].png

Verification:
□ Content accessible
□ PDF downloadable
□ Date stamp correct
□ No corruption detected
```

## Failure Handling

### If Archive Request Fails:
1. **Retry:** Submit again after 30 minutes
2. **Alternative Method:** Use archive.org/save/[url] direct link
3. **Document Failure:** Screenshot error message
4. **Alternative Service:** Use archive.is or archive.today

### If Content Doesn't Load:
1. **Check Original:** Verify publication URL is still live
2. **Resubmit:** Request new archive of current live URL
3. **Document Issue:** Note any changes between captures

## Success Criteria

- [ ] All four publication URLs successfully archived
- [ ] Archive dates show January 20, 2026
- [ ] Archived content loads and displays correctly
- [ ] Screenshots captured for evidence package
- [ ] Wayback URLs documented for future reference

## Cost-Benefit Analysis

**Pros:**
- Completely free
- Immediate submission
- Permanent archival
- Legal recognition in patent proceedings
- Independent verification possible

**Cons:**
- Dependent on Internet Archive service
- No cryptographic proof-of-existence
- Potential for service changes

**Recommendation:** Use as tertiary timestamping method to complement blockchain and RFC 3161 timestamps.

## Integration with Other Methods

1. **Primary:** OpenTimestamps (blockchain anchoring)
2. **Secondary:** DigiStamp (RFC 3161 legal standard)
3. **Tertiary:** Wayback Machine (web preservation)
4. **Quaternary:** Email timestamp (DKIM signatures)

This multi-layer approach provides defense in depth for timestamp evidence.