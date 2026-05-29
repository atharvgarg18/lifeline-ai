# AI Services - LifeLine AI

Python-based AI/ML services for emergency healthcare coordination.

---

## Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Run development server
python app.py

# Run tests
pytest
```

---

## Directory Structure

```
ai-services/
├── src/
│   ├── modules/
│   │   ├── triage/
│   │   │   ├── triage_analyzer.py
│   │   │   ├── triage_model.py
│   │   │   ├── utils.py
│   │   │   └── tests/
│   │   │
│   │   ├── route_optimizer/
│   │   │   ├── route_optimizer.py
│   │   │   ├── traffic_analyzer.py
│   │   │   └── tests/
│   │   │
│   │   ├── symptom_analyzer/
│   │   │   ├── symptom_analyzer.py
│   │   │   ├── symptom_classifier.py
│   │   │   └── tests/
│   │   │
│   │   ├── translator/
│   │   │   ├── translator.py
│   │   │   ├── language_detector.py
│   │   │   └── tests/
│   │   │
│   │   └── analytics/
│   │       ├── complaint_analyzer.py
│   │       ├── hotspot_detector.py
│   │       └── tests/
│   │
│   ├── services/
│   │   ├── api_service.py        # External API calls
│   │   ├── cache_service.py      # Caching layer
│   │   └── logging_service.py
│   │
│   ├── utils/
│   │   ├── validators.py
│   │   ├── formatters.py
│   │   ├── constants.py
│   │   └── errors.py
│   │
│   ├── models/                   # Pre-trained ML models
│   │   ├── triage_model.pkl
│   │   ├── symptom_classifier.pkl
│   │   └── hotspot_detector.pkl
│   │
│   └── config/
│       ├── settings.py
│       └── logging.config
│
├── notebooks/                    # Jupyter notebooks for experimentation
│   ├── triage_analysis.ipynb
│   ├── route_optimization.ipynb
│   └── symptom_classification.ipynb
│
├── data/                         # Sample datasets (for testing)
│   ├── sample_symptoms.csv
│   ├── sample_complaints.json
│   └── sample_routes.json
│
├── tests/
│   ├── unit/
│   │   └── test_*.py
│   └── integration/
│       └── test_*.py
│
├── requirements.txt              # Python dependencies
├── .env.example
├── app.py                        # FastAPI/Flask entry point
├── pytest.ini
└── README.md
```

---

## Modules Overview

### 1. Emergency Triage Module

AI-powered emergency severity prediction based on symptoms and vitals.

```python
# src/modules/triage/triage_analyzer.py

from typing import Dict, List
import numpy as np
from .triage_model import TriageModel

class TriageAnalyzer:
    def __init__(self):
        self.model = TriageModel()
    
    def analyze_emergency(self, patient_data: Dict) -> Dict:
        """
        Analyze emergency severity based on symptoms and vitals.
        
        Args:
            patient_data: {
                'symptoms': [{'name': 'chest_pain', 'severity': 8}],
                'vitals': {'heart_rate': 120, 'bp': '160/100'},
                'medical_history': {...}
            }
        
        Returns:
            {
                'severity_score': 8.5,
                'priority': 'CRITICAL',
                'diagnosis_hypothesis': [...],
                'recommended_specialization': 'Cardiology',
                'first_aid_suggestions': [...]
            }
        """
        # 1. Feature extraction
        features = self._extract_features(patient_data)
        
        # 2. Predict severity
        severity_score = self.model.predict(features)
        
        # 3. Generate recommendations
        recommendations = self._generate_recommendations(
            patient_data,
            severity_score
        )
        
        return {
            'severity_score': float(severity_score),
            'priority': self._score_to_priority(severity_score),
            'diagnosis_hypothesis': recommendations['diagnosis'],
            'recommended_specialization': recommendations['specialization'],
            'first_aid_suggestions': recommendations['first_aid'],
            'confidence': float(self.model.confidence)
        }
    
    def _extract_features(self, patient_data: Dict) -> np.ndarray:
        """Convert patient data to ML features."""
        # Feature engineering logic
        pass
    
    def _generate_recommendations(self, patient_data: Dict, severity: float) -> Dict:
        """Generate medical recommendations based on severity."""
        pass
```

**API Endpoint:**
```
POST /api/v1/triage/analyze
Content-Type: application/json

{
  "patientId": "patient-123",
  "symptoms": [
    {
      "symptom": "Chest pain",
      "severity": 8,
      "duration": 30,
      "onset": "SUDDEN"
    }
  ],
  "vitals": {
    "heartRate": 120,
    "bloodPressure": "160/100",
    "temperature": 37.2,
    "respiratoryRate": 28
  },
  "medicalHistory": {
    "chronicDiseases": ["Hypertension"],
    "medications": ["Lisinopril"]
  }
}

Response (200):
{
  "severity_score": 8.5,
  "priority": "CRITICAL",
  "diagnosis_hypothesis": [
    {
      "condition": "Acute Coronary Syndrome",
      "probability": 0.85,
      "recommended_specialization": "Cardiology"
    }
  ],
  "recommended_doctor_specialization": "Cardiology",
  "recommended_bed_type": "ICU",
  "first_aid_suggestions": [
    "Give aspirin (if not allergic)",
    "Position in semi-upright position"
  ]
}
```

---

### 2. Route Optimization Module

AI-powered route optimization considering traffic and emergency prioritization.

```python
# src/modules/route_optimizer/route_optimizer.py

class RouteOptimizer:
    def __init__(self):
        self.traffic_analyzer = TrafficAnalyzer()
    
    def optimize_route(self, origin: Dict, destination: Dict, **options) -> Dict:
        """
        Get optimized route for ambulance.
        
        Args:
            origin: {'latitude': 28.7041, 'longitude': 77.1025}
            destination: {'latitude': 28.5355, 'longitude': 77.3910}
            options: {'emergency': True, 'avoid_toll_roads': False, ...}
        
        Returns:
            {
                'distance': 26.5,  # km
                'duration': 22,    # minutes
                'coordinates': [...],  # waypoints
                'traffic_delay': 4,
                'green_corridor': {...}
            }
        """
        # 1. Get routes from Maps API
        routes = self._get_routes(origin, destination)
        
        # 2. Analyze traffic for each route
        routes_with_traffic = [
            self._analyze_traffic(route, options)
            for route in routes
        ]
        
        # 3. Select best route
        best_route = self._select_best_route(
            routes_with_traffic,
            options.get('emergency', False)
        )
        
        # 4. Generate green corridor if emergency
        if options.get('emergency'):
            best_route['green_corridor'] = self._simulate_green_corridor(
                best_route
            )
        
        return best_route
```

**API Endpoint:**
```
POST /api/v1/route/optimize

{
  "origin": {"latitude": 28.7041, "longitude": 77.1025},
  "destination": {"latitude": 28.5355, "longitude": 77.3910},
  "preferences": {
    "avoidTollRoads": false,
    "trafficAware": true,
    "emergency": true
  }
}

Response (200):
{
  "distance": 26.5,
  "duration": 22,
  "durationNoTraffic": 18,
  "coordinates": [...],
  "trafficInfo": {
    "hasTraffic": true,
    "severity": "MODERATE",
    "affectedSegments": [...]
  },
  "greenCorridor": {
    "available": true,
    "estTimeWithCorridor": 18,
    "estimatedDelay": 0
  }
}
```

---

### 3. Symptom Analyzer Module

Multi-language symptom analysis and categorization.

```python
# src/modules/symptom_analyzer/symptom_analyzer.py

class SymptomAnalyzer:
    def analyze_symptoms(self, symptoms: List[str], language: str = 'en') -> Dict:
        """
        Analyze reported symptoms and provide emergency assistance.
        
        Args:
            symptoms: ['chest_pain', 'shortness_of_breath']
            language: 'hi', 'en', 'ta', etc.
        
        Returns:
            {
                'analyzed_symptoms': [...],
                'primary_concern': 'Cardiac',
                'emergency_risk': 'HIGH',
                'immediate_actions': [...],
                'warning_signs': [...]
            }
        """
        pass
```

---

### 4. Language Translator Module

Multi-language support for rural accessibility.

```python
# src/modules/translator/translator.py

class Translator:
    def translate(self, text: str, target_language: str) -> Dict:
        """
        Translate text to target language.
        
        Uses: Google Translate API or offline models
        """
        pass
    
    def detect_language(self, text: str) -> str:
        """Detect language of input text."""
        pass
```

**API Endpoint:**
```
POST /api/v1/translate

{
  "text": "The ambulance is arriving in 5 minutes",
  "targetLanguage": "HINDI"
}

Response (200):
{
  "original_text": "The ambulance is arriving in 5 minutes",
  "translated_text": "एम्बुलेंस 5 मिनट में आ रहा है",
  "target_language": "HINDI",
  "confidence": 0.98
}
```

---

### 5. Complaint Analytics Module

AI analysis of complaints for pattern detection.

```python
# src/modules/analytics/complaint_analyzer.py

class ComplaintAnalyzer:
    def analyze_complaint(self, complaint: Dict) -> Dict:
        """
        Analyze complaint for categorization and pattern detection.
        
        Returns:
            {
                'category': 'AMBULANCE_DELAY',
                'severity': 'HIGH',
                'similar_complaints': [...],
                'root_cause': '...',
                'recommendations': [...]
            }
        """
        pass

class HotspotDetector:
    def detect_accident_hotspots(self, complaint_data: List[Dict]) -> List[Dict]:
        """
        Detect accident-prone areas using complaint/emergency data.
        
        Returns:
            [
                {
                    'location': {'lat': 28.7041, 'lng': 77.1025},
                    'incident_count': 45,
                    'severity_avg': 7.2,
                    'hotspot_name': 'Delhi-Gurgaon Highway'
                }
            ]
        """
        pass
```

---

## Environment Variables (.env)

```bash
# Server
DEBUG=True
PORT=8000
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/lifeline-ai

# External APIs
GOOGLE_MAPS_API_KEY=your-key
GEMINI_API_KEY=your-key
OPENAI_API_KEY=your-key

# Models
TRIAGE_MODEL_PATH=./src/models/triage_model.pkl
SYMPTOM_MODEL_PATH=./src/models/symptom_classifier.pkl

# Cache
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=DEBUG
LOG_FILE=./logs/app.log

# Feature flags
USE_OFFLINE_MODE=False
ENABLE_CACHING=True
```

---

## Development Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Development server
python app.py

# Run tests
pytest
pytest -v                    # Verbose
pytest tests/unit/          # Specific directory
pytest --cov               # With coverage

# Format code
black src/
autopep8 --in-place -r src/

# Linting
pylint src/
flake8 src/

# Type checking
mypy src/

# Jupyter notebooks
jupyter notebook

# Update requirements
pip freeze > requirements.txt
```

---

## Code Standards

### Python Style Guide (PEP 8)

```python
# Imports
from typing import Dict, List, Optional
import numpy as np
from src.utils import validators

# Class naming: PascalCase
class TriageAnalyzer:
    def __init__(self):
        self.model = None

# Function naming: snake_case
def analyze_emergency(patient_data: Dict) -> Dict:
    """
    Analyze emergency severity.
    
    Args:
        patient_data: Dictionary with patient information
    
    Returns:
        Dictionary with analysis results
    
    Raises:
        ValueError: If patient data is invalid
    """
    pass

# Constants: UPPER_SNAKE_CASE
MAX_RETRY_ATTEMPTS = 3
DEFAULT_TIMEOUT = 5.0
```

### Error Handling

```python
class AIServiceError(Exception):
    """Base exception for AI services."""
    pass

class TriageError(AIServiceError):
    """Exception for triage analysis failures."""
    pass

# Usage
try:
    result = analyzer.analyze_emergency(patient_data)
except TriageError as e:
    logger.error(f"Triage analysis failed: {e}")
    raise
```

---

## Model Training & Optimization

### Triage Model Training Pipeline

```python
# scripts/train_triage_model.py

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib

# 1. Load training data
df = pd.read_csv('data/triage_training_data.csv')

# 2. Feature engineering
X = df[['symptom_1', 'symptom_2', 'heart_rate', 'bp_systolic', 'bp_diastolic']]
y = df['severity_label']

# 3. Train model
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_scaled, y)

# 4. Save model
joblib.dump(model, 'src/models/triage_model.pkl')
joblib.dump(scaler, 'src/models/triage_scaler.pkl')

print("Model trained and saved successfully")
```

---

## Testing

### Unit Tests

```python
# tests/unit/test_triage_analyzer.py

import pytest
from src.modules.triage import TriageAnalyzer

@pytest.fixture
def analyzer():
    return TriageAnalyzer()

def test_analyze_emergency_critical(analyzer):
    patient_data = {
        'symptoms': [{'name': 'chest_pain', 'severity': 9}],
        'vitals': {'heart_rate': 140, 'bp': '180/110'}
    }
    
    result = analyzer.analyze_emergency(patient_data)
    
    assert result['severity_score'] > 8
    assert result['priority'] == 'CRITICAL'
    assert 'Cardiology' in result['recommended_specialization']

def test_analyze_emergency_invalid_data(analyzer):
    with pytest.raises(ValueError):
        analyzer.analyze_emergency({})
```

---

## Performance Considerations

1. **Model Size**: Keep models < 100MB
2. **Inference Time**: < 500ms per request
3. **Batch Processing**: Use async processing for non-critical tasks
4. **Caching**: Cache frequently used translations and route calculations
5. **API Calls**: Implement request batching

---

## Deployment

See [docs/DEPLOYMENT_GUIDE.md](../../docs/DEPLOYMENT_GUIDE.md)

---

## Troubleshooting

### Model Loading Error
```bash
python -c "import joblib; joblib.load('src/models/triage_model.pkl')"
```

### Dependency Conflicts
```bash
pip install -r requirements.txt --upgrade
```

---

## Related Documentation

- [Architecture](../../docs/ARCHITECTURE.md)
- [API Specification](../../docs/API_SPECIFICATION.md)
- [Development Guide](../../docs/DEVELOPMENT_GUIDE.md)

---

**Last Updated**: May 27, 2026
