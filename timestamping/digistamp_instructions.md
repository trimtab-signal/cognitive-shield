# DigiStamp RFC 3161 Instructions

**Service:** DigiStamp (digistamp.com)
**Cost:** $0.40 per timestamp (minimum $10 for 25 timestamps)
**Method:** RFC 3161 Trusted Timestamping
**Timeline:** Immediate (within minutes)
**Legal Standard:** FIPS 140-2 Level 4 certified HSM

## Prerequisites

1. **Web Browser:** Modern browser with JavaScript enabled
2. **Document Hash:** SHA-256 hash ready: `2d017d7ee05c244741f0bbb3be6f82d65bbc65546096424203b7fbdd9e3906b6`
3. **Payment Method:** Credit card or PayPal for $10 minimum

## Step-by-Step Process

### 1. Account Registration
```text
Visit: https://www.digistamp.com/
Click: "Create Account" or "Sign Up"
Fill: Business/Individual account details
Verify: Email address
Login: With new credentials
```

### 2. Purchase Timestamps
```text
Navigate: Dashboard → Buy Timestamps
Select: Quantity (minimum 25 = $10)
Payment: Credit card/PayPal
Confirm: Order completion
Result: Credit balance updated
```

### 3. Create Timestamp
```text
Navigate: Dashboard → Create Timestamp
Method: Select "Hash Input"
Hash Type: SHA-256
Hash Value: 2d017d7ee05c244741f0bbb3be6f82d65bbc65546096424203b7fbdd9e3906b6
Comment: SIC-POVM QKD Defensive Publication - January 20, 2026
Submit: Create timestamp
```

### 4. Download Token
```text
Result: .tsr timestamp token generated
Download: SIC_POVM_QKD_DEFENSIVE_PUBLICATION.tsr
Verify: File size ~2KB, contains timestamp data
```

## Verification Process

### Online Verification
```text
Visit: https://www.digistamp.com/verify
Upload: Original PDF + .tsr token
Result: Green "Valid" confirmation with exact timestamp
```

### Independent Verification
```text
Use RFC 3161 verification tools:
- OpenSSL: openssl ts -verify -in token.tsr -data document.pdf -CAfile digistamp.crt
- Third-party verifiers supporting RFC 3161
```

## Security Features

- **FIPS 140-2 Level 4:** Highest NIST certification level
- **Hardware Security Module:** Dedicated HSM for timestamping
- **Clock Accuracy:** ±1 second synchronized to NIST/USNO
- **Cryptographic Algorithms:** RSA-4096 with SHA-256
- **Audit Trail:** Complete operation logging

## Legal Admissibility

- **RFC 3161 Standard:** Internationally recognized timestamping standard
- **Court Precedence:** Accepted in U.S. and European courts
- **eIDAS Compliance:** Qualified timestamp under EU regulation
- **Chain of Trust:** Certificate chain to trusted root

## Cost Structure

| Quantity | Cost | Cost Per Stamp | Use Case |
|----------|------|----------------|----------|
| 25 | $10 | $0.40 | Minimum purchase |
| 50 | $20 | $0.40 | Extended use |
| 100 | $40 | $0.40 | Enterprise use |
| 500 | $200 | $0.40 | Bulk timestamping |

## File Management

```
Original: SIC_POVM_QKD_DEFENSIVE_PUBLICATION.pdf
Token:    SIC_POVM_QKD_DEFENSIVE_PUBLICATION.tsr
Backup:   Multiple secure locations
Archive:  Include in evidence package
```

## Integration Options

### API Access (Enterprise)
```javascript
// REST API example
const response = await fetch('https://api.digistamp.com/v1/timestamp', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + apiKey },
  body: JSON.stringify({
    hash: '2d017d7ee05c244741f0bbb3be6f82d65bbc65546096424203b7fbdd9e3906b6',
    comment: 'Defensive publication timestamp'
  })
});
```

## Emergency Procedures

### If Service Unavailable:
1. Use alternative RFC 3161 provider (GlobalSign, Sectigo)
2. Document unavailability with screenshots
3. Apply additional verification methods
4. Maintain complete evidence chain

### If Payment Fails:
1. Use alternative payment method
2. Contact DigiStamp support
3. Document payment attempt
4. Consider smaller quantity purchase

## Success Criteria

- [ ] .tsr token downloaded successfully
- [ ] Online verification shows "Valid"
- [ ] Timestamp accurate to January 20, 2026
- [ ] File integrity maintained
- [ ] Receipt saved for records

## Best Practices

1. **Multiple Timestamps:** Purchase 25+ for future needs
2. **Regular Backups:** Store tokens in multiple locations
3. **Documentation:** Record all transaction details
4. **Verification:** Test verification process immediately
5. **Chain of Custody:** Maintain complete audit trail

**Recommended:** Use DigiStamp as secondary timestamping method to complement OpenTimestamps' blockchain anchoring.