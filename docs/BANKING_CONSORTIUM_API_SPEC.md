# BANKING CONSORTIUM API SPECIFICATION & UNDERWRITING PROTOCOL
## HRL International Private Limited × Rohan Corporation Digital Bridge
**Specification Version:** v2.4 (OpenAPI 3.1 Compliant Architecture)  
**Classification:** Restricted Institutional Financial Specification  
**Publication Date:** September 6, 2026  
**Consortium Gateway Desk:** hrlinternationalprivatelimited@gmail.com  

---

## 1. Consortium Overview & Integration Purpose

The Banking Consortium API Bridge establishes a secure, real-time interface connecting the HRL × Rohan Corporation sales platform with leading Indian scheduled commercial banks (HDFC Bank, State Bank of India, and ICICI Bank). The bridge accelerates loan sanctions from weeks to minutes through automated in-principle approval (IPA) workflows and instant title search validation.

```
+------------------+       mTLS / OAuth 2.0       +--------------------------+
|  HRL x ROHAN     | ==========================> |  BANKING CONSORTIUM API  |
|  SALES PLATFORM  | <========================== |  GATEWAY (PCI-DSS / RBI) |
+------------------+                              +--------------------------+
                                                               |
                             +---------------------------------+---------------------------------+
                             |                                 |                                 |
                             v                                 v                                 v
                     +---------------+                 +---------------+                 +---------------+
                     |   HDFC BANK   |                 |   SBI RBO     |                 |  ICICI BANK   |
                     |  REACH LOANS  |                 |  COMMERCIAL   |                 | MORTGAGE API  |
                     +---------------+                 +---------------+                 +---------------+
```

---

## 2. Authentication & Cryptographic Security

- **Transport Layer:** Mutual TLS (mTLS v1.3) with RSA 4096-bit client certificates.
- **Authorization:** OAuth 2.0 Client Credentials Grant returning signed JSON Web Tokens (JWT) with 15-minute TTL.
- **Data Protection:** All PII fields (PAN, Aadhaar virtual ID, salary credit) encrypted via AES-256-GCM.
- **Regulatory Compliance:** Compliant with Reserve Bank of India Master Direction on Digital Lending (2022) and DPDP Act (2023).

---

## 3. Core API Endpoints

### 3.1 Real-Time Benchmark Rates Query
- **Endpoint:** `GET /api/v1/consortium/rates`
- **Description:** Returns the live Repo-Linked Lending Rate (RLLR / EBLR) and sovereign commercial lending benchmarks.
- **Sample Response:**
```json
{
  "timestamp": "2026-09-06T12:00:00Z",
  "rbiRepoRate": 6.50,
  "consortiumRates": [
    {
      "bankCode": "SBI",
      "bankName": "State Bank of India",
      "commercialInterestRate": 8.75,
      "residentialInterestRate": 8.40,
      "maxTenureYears": 20,
      "processingFeeDiscount": "50% off for Rohan Corp Joint Projects"
    },
    {
      "bankCode": "HDFC",
      "bankName": "HDFC Bank Ltd",
      "commercialInterestRate": 8.90,
      "residentialInterestRate": 8.50,
      "maxTenureYears": 25,
      "processingFeeDiscount": "Zero processing fee for pre-approved corporate clients"
    },
    {
      "bankCode": "ICICI",
      "bankName": "ICICI Bank",
      "commercialInterestRate": 8.85,
      "residentialInterestRate": 8.45,
      "maxTenureYears": 25,
      "processingFeeDiscount": "Flat INR 5,000 for verified NRI remittances"
    }
  ]
}
```

---

### 3.2 Algorithmic Pre-Approval & FOIR Underwriting
- **Endpoint:** `POST /api/v1/consortium/underwrite`
- **Description:** Computes Debt-to-Income (DTI), Fixed Obligation to Income Ratio (FOIR), and returns pre-qualified credit envelope.
- **Sample Request Payload:**
```json
{
  "applicantRef": "HRL-INV-2026-8891",
  "applicantType": "NRI_INDIVIDUAL",
  "residenceCountry": "ARE",
  "monthlyGrossIncomeINR": 650000,
  "existingMonthlyObligationsINR": 50000,
  "cibilScore": 790,
  "propertyDetails": {
    "projectIdentifier": "CITY_SCAPE",
    "reraNumber": "PRM/KA/RERA/1257/334/PR/210222/003924",
    "unitIdentifier": "CS-L4-COMMERCIAL-01",
    "totalValuationINR": 21500000,
    "requestedLoanAmountINR": 15000000,
    "proposedTenureMonths": 180
  }
}
```
- **Sample Response:**
```json
{
  "status": "PRE_APPROVED",
  "foirRatio": 35.8,
  "foirBenchmarkLimit": 40.0,
  "eligibleLoanAmountINR": 15000000,
  "approvedTenureMonths": 180,
  "indicativeEmiINR": 150820,
  "sanctionLetterToken": "IPA-HDFC-SBI-2026-992147",
  "conditionalClauses": [
    "Subject to FIRC verification from UAE Central Bank authorized remittance",
    "Satisfactory completion of title deed endorsement at Mangaluru Sub-Registrar"
  ]
}
```

---

### 3.3 Instant Project e-NOC Verification
- **Endpoint:** `POST /api/v1/consortium/instant-e-noc`
- **Description:** Verifies that Rohan Corporation has received pre-clearance and Master Project Approval from the banking consortium, allowing instantaneous release of title No-Objection Certificates.
- **Response:** Digital e-NOC cryptographic certificate verifying zero prior mortgage encumbrances on specific commercial units.

---

### 3.4 Cross-Border SWIFT Inward Remittance Tracker
- **Endpoint:** `POST /api/v1/remittance/swift-verify`
- **Description:** NRI/OCI wire monitoring connecting to RBI AD-Category 1 banking desks to automatically generate FIRC (Foreign Inward Remittance Certificate) and Form A2 clearance.

---

## 4. Error Handling & Institutional Telemetry

The API adheres to RFC 7807 Problem Details for HTTP APIs:
- `400 Invalid Payload:` Validation failure on RERA registration or currency formatting.
- `401 Unauthorized:` Expired mTLS certificate or invalidated OAuth token.
- `422 Credit Boundary Exceeded:` FOIR exceeds institutional ceiling (>50%).
- `503 Consortium Node Unavailable:` Automatic fallback to secondary consortium node with zero transaction drops.

---

*HRL International Private Limited Fintech Integration Architecture.*
