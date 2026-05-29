# Database Schema - LifeLine AI

## Database Type: MongoDB

MongoDB is chosen for flexibility with real-time emergency data and easy schema evolution.

---

## Collections & Schemas

### 1. Users Collection

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "passwordHash", "userType", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        email: { 
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        passwordHash: { bsonType: "string" },
        phoneNumber: { bsonType: "string" },
        userType: { 
          enum: ["PATIENT", "DOCTOR", "AMBULANCE_DRIVER", "HOSPITAL_ADMIN", "SYSTEM_ADMIN"]
        },
        profile: {
          bsonType: "object",
          properties: {
            firstName: { bsonType: "string" },
            lastName: { bsonType: "string" },
            profilePictureUrl: { bsonType: "string" },
            dateOfBirth: { bsonType: "date" },
            gender: { enum: ["MALE", "FEMALE", "OTHER"] },
            address: { bsonType: "string" },
            city: { bsonType: "string" },
            state: { bsonType: "string" },
            pincode: { bsonType: "string" },
            language: { enum: ["HINDI", "ENGLISH", "TAMIL", "TELUGU", "KANNADA", "MARATHI"] }
          }
        },
        status: {
          enum: ["ACTIVE", "INACTIVE", "SUSPENDED", "DELETED"]
        },
        isVerified: { bsonType: "bool" },
        lastLogin: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        deletedAt: { bsonType: "date" }
      }
    }
  }
});

// Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ phoneNumber: 1 });
db.users.createIndex({ userType: 1 });
db.users.createIndex({ createdAt: -1 });
```

---

### 2. Patients Collection

```javascript
db.createCollection("patients", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" }, // Reference to users._id
        healthIdNumber: { 
          bsonType: "string",
          description: "Digital emergency health ID"
        },
        bloodGroup: {
          enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "UNKNOWN"]
        },
        allergies: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        chronicDiseases: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        medications: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: { bsonType: "string" },
              dosage: { bsonType: "string" },
              frequency: { bsonType: "string" },
              startDate: { bsonType: "date" },
              endDate: { bsonType: "date" }
            }
          }
        },
        pastSurgeries: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: { bsonType: "string" },
              date: { bsonType: "date" },
              hospital: { bsonType: "string" },
              surgeon: { bsonType: "string" },
              notes: { bsonType: "string" }
            }
          }
        },
        emergencyContacts: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              name: { bsonType: "string" },
              relation: { bsonType: "string" },
              phoneNumber: { bsonType: "string" },
              email: { bsonType: "string" }
            }
          }
        },
        insuranceDetails: {
          bsonType: "object",
          properties: {
            providerName: { bsonType: "string" },
            policyNumber: { bsonType: "string" },
            groupNumber: { bsonType: "string" },
            coverageAmount: { bsonType: "int" },
            expiryDate: { bsonType: "date" }
          }
        },
        profileCompleted: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.patients.createIndex({ userId: 1 }, { unique: true });
db.patients.createIndex({ healthIdNumber: 1 });
db.patients.createIndex({ createdAt: -1 });
```

---

### 3. EmergencySOS Collection

```javascript
db.createCollection("emergencySOS", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["patientId", "location", "status", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        patientId: { bsonType: "objectId" },
        emergencyType: {
          enum: ["ACCIDENT", "MEDICAL", "OTHER"]
        },
        status: {
          enum: ["INITIATED", "DISPATCHED", "IN_TRANSIT", "HOSPITAL_NOTIFIED", "ARRIVED", "ADMITTED", "IN_TREATMENT", "DISCHARGED", "COMPLETED", "CANCELLED"]
        },
        location: {
          bsonType: "object",
          required: ["type", "coordinates"],
          properties: {
            type: { enum: ["Point"] },
            coordinates: {
              bsonType: "array",
              items: { bsonType: "double" }
            },
            address: { bsonType: "string" }
          }
        },
        description: { bsonType: "string" },
        severityScore: { 
          bsonType: "double",
          minimum: 1,
          maximum: 10
        },
        priority: {
          enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
        },
        assignedAmbulanceId: { bsonType: "objectId" },
        assignedHospitalId: { bsonType: "objectId" },
        assignedDoctorId: { bsonType: "objectId" },
        triageDataId: { bsonType: "objectId" },
        estimatedArrivalTime: { bsonType: "int" },
        actualArrivalTime: { bsonType: "int" },
        timeline: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              status: { bsonType: "string" },
              timestamp: { bsonType: "date" },
              note: { bsonType: "string" }
            }
          }
        },
        familyNotificationSent: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        completedAt: { bsonType: "date" },
        cancelledAt: { bsonType: "date" },
        cancelledReason: { bsonType: "string" }
      }
    }
  }
});

db.emergencySOS.createIndex({ patientId: 1, createdAt: -1 });
db.emergencySOS.createIndex({ status: 1, createdAt: -1 });
db.emergencySOS.createIndex({ location: "2dsphere" });
db.emergencySOS.createIndex({ assignedAmbulanceId: 1 });
db.emergencySOS.createIndex({ assignedHospitalId: 1 });
db.emergencySOS.createIndex({ priority: 1 });
db.emergencySOS.createIndex({ createdAt: -1 });
```

---

### 4. Ambulances Collection

```javascript
db.createCollection("ambulances", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["registrationNumber", "driverId", "status", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        registrationNumber: { bsonType: "string" },
        driverId: { bsonType: "objectId" },
        status: {
          enum: ["AVAILABLE", "IN_SERVICE", "MAINTENANCE", "OFF_DUTY"]
        },
        vehicleType: {
          enum: ["BLS", "ALS", "ADVANCED"]
        },
        location: {
          bsonType: "object",
          properties: {
            type: { enum: ["Point"] },
            coordinates: { bsonType: "array" },
            address: { bsonType: "string" },
            lastUpdated: { bsonType: "date" }
          }
        },
        equipment: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        hospitalBaseId: { bsonType: "objectId" },
        capacity: {
          bsonType: "object",
          properties: {
            stretchers: { bsonType: "int" },
            patients: { bsonType: "int" }
          }
        },
        currentEmergencyId: { bsonType: "objectId" },
        rating: { 
          bsonType: "double",
          minimum: 1,
          maximum: 5
        },
        totalTrips: { bsonType: "int" },
        insurance: {
          bsonType: "object",
          properties: {
            provider: { bsonType: "string" },
            expiryDate: { bsonType: "date" }
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.ambulances.createIndex({ location: "2dsphere" });
db.ambulances.createIndex({ status: 1 });
db.ambulances.createIndex({ driverId: 1 });
db.ambulances.createIndex({ currentEmergencyId: 1 });
```

---

### 5. AmbulanceLocations Collection (Real-time tracking)

```javascript
db.createCollection("ambulanceLocations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ambulanceId", "location", "timestamp"],
      properties: {
        _id: { bsonType: "objectId" },
        ambulanceId: { bsonType: "objectId" },
        location: {
          bsonType: "object",
          properties: {
            type: { enum: ["Point"] },
            coordinates: { bsonType: "array" }
          }
        },
        speed: { bsonType: "double" },
        heading: { bsonType: "double" },
        accuracy: { bsonType: "double" },
        timestamp: { bsonType: "date" }
      }
    }
  }
});

// TTL index - auto-delete after 7 days
db.ambulanceLocations.createIndex({ timestamp: 1 }, { expireAfterSeconds: 604800 });
db.ambulanceLocations.createIndex({ ambulanceId: 1, timestamp: -1 });
db.ambulanceLocations.createIndex({ location: "2dsphere" });
```

---

### 6. Hospitals Collection

```javascript
db.createCollection("hospitals", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "location", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        registrationNumber: { bsonType: "string" },
        location: {
          bsonType: "object",
          properties: {
            type: { enum: ["Point"] },
            coordinates: { bsonType: "array" },
            address: { bsonType: "string" },
            city: { bsonType: "string" },
            state: { bsonType: "string" },
            pincode: { bsonType: "string" }
          }
        },
        phoneNumber: { bsonType: "string" },
        email: { bsonType: "string" },
        website: { bsonType: "string" },
        type: {
          enum: ["PRIVATE", "GOVERNMENT", "NGO"]
        },
        rating: { bsonType: "double" },
        beds: {
          bsonType: "object",
          properties: {
            general: {
              bsonType: "object",
              properties: {
                total: { bsonType: "int" },
                occupied: { bsonType: "int" },
                available: { bsonType: "int" }
              }
            },
            icu: {
              bsonType: "object",
              properties: {
                total: { bsonType: "int" },
                occupied: { bsonType: "int" },
                available: { bsonType: "int" }
              }
            },
            highDependency: {
              bsonType: "object",
              properties: {
                total: { bsonType: "int" },
                occupied: { bsonType: "int" },
                available: { bsonType: "int" }
              }
            }
          }
        },
        specializations: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        operatingHours: {
          bsonType: "object",
          properties: {
            openTime: { bsonType: "string" },
            closeTime: { bsonType: "string" },
            emergency24x7: { bsonType: "bool" }
          }
        },
        averageWaitTime: { bsonType: "int" },
        overloadStatus: {
          enum: ["AVAILABLE", "MEDIUM_LOAD", "OVERLOADED"]
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.hospitals.createIndex({ location: "2dsphere" });
db.hospitals.createIndex({ name: "text" });
db.hospitals.createIndex({ specializations: 1 });
db.hospitals.createIndex({ overloadStatus: 1 });
```

---

### 7. TriageData Collection

```javascript
db.createCollection("triageData", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["emergencyId", "patientId", "severityScore", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        emergencyId: { bsonType: "objectId" },
        patientId: { bsonType: "objectId" },
        symptoms: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              symptom: { bsonType: "string" },
              severity: { bsonType: "int" },
              duration: { bsonType: "int" },
              onset: { enum: ["SUDDEN", "GRADUAL"] }
            }
          }
        },
        vitals: {
          bsonType: "object",
          properties: {
            heartRate: { bsonType: "int" },
            bloodPressure: { bsonType: "string" },
            temperature: { bsonType: "double" },
            respiratoryRate: { bsonType: "int" },
            oxygenSaturation: { bsonType: "double" }
          }
        },
        severityScore: { bsonType: "double" },
        priority: {
          enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
        },
        diagnosticHypothesis: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              condition: { bsonType: "string" },
              probability: { bsonType: "double" },
              recommendedSpecialization: { bsonType: "string" }
            }
          }
        },
        recommendedDoctorSpecialization: { bsonType: "string" },
        recommendedBedType: {
          enum: ["GENERAL", "ICU", "HIGH_DEPENDENCY"]
        },
        firstAidSuggestions: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        aiModel: { bsonType: "string" },
        confidence: { bsonType: "double" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.triageData.createIndex({ emergencyId: 1 }, { unique: true });
db.triageData.createIndex({ patientId: 1 });
db.triageData.createIndex({ priority: 1 });
```

---

### 8. Doctors Collection

```javascript
db.createCollection("doctors", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "specialization", "licenseNumber"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        licenseNumber: { bsonType: "string" },
        specialization: { bsonType: "string" },
        qualifications: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        hospitalAffiliations: {
          bsonType: "array",
          items: { bsonType: "objectId" }
        },
        availabilityStatus: {
          enum: ["AVAILABLE", "BUSY", "OFF_DUTY"]
        },
        currentAssignmentCount: { bsonType: "int" },
        maxConcurrentAssignments: { bsonType: "int" },
        rating: { bsonType: "double" },
        totalConsultations: { bsonType: "int" },
        averageConsultationTime: { bsonType: "int" },
        responseTime: { bsonType: "int" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.doctors.createIndex({ userId: 1 }, { unique: true });
db.doctors.createIndex({ specialization: 1 });
db.doctors.createIndex({ hospitalAffiliations: 1 });
db.doctors.createIndex({ availabilityStatus: 1 });
```

---

### 9. Complaints Collection

```javascript
db.createCollection("complaints", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["complaintType", "filledBy", "status", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        ticketNumber: { bsonType: "string" },
        complaintType: {
          enum: ["AMBULANCE_DELAY", "HOSPITAL_ISSUE", "STAFF_UNAVAILABLE", "MEDICINE_SHORTAGE", "OTHER"]
        },
        status: {
          enum: ["REGISTERED", "UNDER_REVIEW", "RESOLVED", "REJECTED"]
        },
        priority: {
          enum: ["LOW", "MEDIUM", "HIGH"]
        },
        emergencyId: { bsonType: "objectId" },
        filledBy: { bsonType: "objectId" },
        description: { bsonType: "string" },
        relatedEntity: {
          bsonType: "object",
          properties: {
            type: { enum: ["AMBULANCE", "HOSPITAL", "STAFF", "OTHER"] },
            id: { bsonType: "objectId" }
          }
        },
        attachments: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        aiCategory: { bsonType: "string" },
        aiSimilarComplaints: {
          bsonType: "array",
          items: { bsonType: "objectId" }
        },
        reviewedBy: { bsonType: "objectId" },
        resolution: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        resolvedAt: { bsonType: "date" }
      }
    }
  }
});

db.complaints.createIndex({ ticketNumber: 1 }, { unique: true });
db.complaints.createIndex({ status: 1, createdAt: -1 });
db.complaints.createIndex({ complaintType: 1 });
db.complaints.createIndex({ filledBy: 1, createdAt: -1 });
db.complaints.createIndex({ aiCategory: 1 });
```

---

### 10. Notifications Collection

```javascript
db.createCollection("notifications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["recipient", "type", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        recipient: { bsonType: "objectId" },
        type: {
          enum: ["EMERGENCY_ALERT", "AMBULANCE_ARRIVAL", "HOSPITAL_ADMISSION", "FAMILY_ALERT", "COMPLAINT_UPDATE"]
        },
        title: { bsonType: "string" },
        body: { bsonType: "string" },
        data: { bsonType: "object" },
        channels: {
          bsonType: "array",
          items: { enum: ["PUSH", "SMS", "EMAIL", "WHATSAPP"] }
        },
        status: {
          enum: ["PENDING", "SENT", "FAILED", "DELIVERED", "READ"]
        },
        sentAt: { bsonType: "date" },
        readAt: { bsonType: "date" },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

db.notifications.createIndex({ recipient: 1, createdAt: -1 });
db.notifications.createIndex({ type: 1 });
db.notifications.createIndex({ status: 1 });
// TTL index - auto-delete after 90 days
db.notifications.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
```

---

### 11. AmbulanceAssignments Collection

```javascript
db.createCollection("ambulanceAssignments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ambulanceId", "emergencyId", "status", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        ambulanceId: { bsonType: "objectId" },
        emergencyId: { bsonType: "objectId" },
        status: {
          enum: ["ASSIGNED", "EN_ROUTE", "ARRIVED", "COMPLETED", "CANCELLED"]
        },
        priority: {
          enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
        },
        estimatedArrivalTime: { bsonType: "int" },
        actualArrivalTime: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        completedAt: { bsonType: "date" }
      }
    }
  }
});

db.ambulanceAssignments.createIndex({ ambulanceId: 1, status: 1 });
db.ambulanceAssignments.createIndex({ emergencyId: 1 }, { unique: true });
db.ambulanceAssignments.createIndex({ status: 1, createdAt: -1 });
```

---

### 12. DoctorAssignments Collection

```javascript
db.createCollection("doctorAssignments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["doctorId", "patientId", "status", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        doctorId: { bsonType: "objectId" },
        patientId: { bsonType: "objectId" },
        emergencyId: { bsonType: "objectId" },
        status: {
          enum: ["ASSIGNED", "ACTIVE", "COMPLETED", "TRANSFERRED"]
        },
        assignmentReason: { bsonType: "string" },
        estimatedConsultationTime: { bsonType: "int" },
        actualConsultationTime: { bsonType: "int" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        completedAt: { bsonType: "date" }
      }
    }
  }
});

db.doctorAssignments.createIndex({ doctorId: 1, status: 1 });
db.doctorAssignments.createIndex({ patientId: 1 });
db.doctorAssignments.createIndex({ status: 1, createdAt: -1 });
```

---

### 13. Analytics Collection

```javascript
db.createCollection("analytics", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["date", "metric", "value"],
      properties: {
        _id: { bsonType: "objectId" },
        date: { bsonType: "date" },
        metric: { bsonType: "string" },
        value: { bsonType: "int" },
        details: { bsonType: "object" },
        aggregationType: { enum: ["DAILY", "HOURLY", "REAL_TIME"] }
      }
    }
  }
});

db.analytics.createIndex({ date: -1, metric: 1 });
db.analytics.createIndex({ aggregationType: 1 });
// TTL index - keep for 1 year
db.analytics.createIndex({ date: 1 }, { expireAfterSeconds: 31536000 });
```

---

### 14. Sessions Collection (For JWT refresh)

```javascript
db.createCollection("sessions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "token", "expiresAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        token: { bsonType: "string" },
        refreshToken: { bsonType: "string" },
        deviceInfo: {
          bsonType: "object",
          properties: {
            userAgent: { bsonType: "string" },
            ipAddress: { bsonType: "string" }
          }
        },
        expiresAt: { bsonType: "date" },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

db.sessions.createIndex({ userId: 1 });
db.sessions.createIndex({ token: 1 });
// TTL index - auto-delete expired sessions
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

---

## Indexes Summary

```javascript
// Performance indexes for common queries
db.emergencySOS.createIndex({ status: 1, createdAt: -1 });
db.emergencySOS.createIndex({ location: "2dsphere" });
db.ambulances.createIndex({ location: "2dsphere" });
db.hospitals.createIndex({ location: "2dsphere" });
db.ambulances.createIndex({ status: 1 });
db.complaints.createIndex({ status: 1, createdAt: -1 });
db.doctors.createIndex({ specialization: 1 });
db.patients.createIndex({ userId: 1 });

// Text search indexes
db.hospitals.createIndex({ name: "text", address: "text" });
db.doctors.createIndex({ specialization: "text" });
```

---

## Data Relationships

```
Users (1) ──> (1) Patients
Users (1) ──> (1) Doctors
Users (1) ──> (1) AmbulanceDrivers

Patients (1) ──> (N) EmergencySOS
EmergencySOS (1) ──> (1) Ambulances (via ambulanceId)
EmergencySOS (1) ──> (1) Hospitals (via hospitalId)
EmergencySOS (1) ──> (1) Doctors (via doctorId)
EmergencySOS (1) ──> (1) TriageData

Ambulances (1) ──> (1) Hospitals (via hospitalBaseId)
Ambulances (1) ──> (N) AmbulanceLocations

Doctors (N) ──> (N) Hospitals (via hospitalAffiliations)

EmergencySOS (1) ──> (N) Complaints
EmergencySOS (1) ──> (N) AmbulanceAssignments
Patients (1) ──> (N) DoctorAssignments
```

---

## Data Migration Strategy

### Phase 1: Initial Setup
```
1. Create collections
2. Add indexes
3. Insert initial hospital data
4. Insert test ambulances
```

### Phase 2: Production Migration
```
1. Backup current data
2. Create new collections in parallel
3. Migrate data with validation
4. Verify data integrity
5. Switch traffic
6. Monitor for 24 hours
7. Cleanup old collections
```

---

## Backup & Recovery

```
Backup Strategy:
- Daily full backup (MongoDB Atlas)
- Point-in-time recovery (30 days)
- Automated backup to AWS S3
- Recovery time objective (RTO): 4 hours
- Recovery point objective (RPO): 1 hour

Critical Collections to backup immediately:
- EmergencySOS
- Patients
- Hospitals
- Complaints
```

---

## Data Retention Policy

```
Collection            Retention Period
─────────────────────────────────────
users                 Permanent (with soft delete)
patients              Permanent (with soft delete)
emergencySOS          5 years (for legal compliance)
triageData            5 years
ambulanceLocations    7 days
notifications         90 days
analytics             1 year
sessions              Expires naturally
```

---

**Last Updated**: May 27, 2026
**Database Version**: MongoDB 5.0+
