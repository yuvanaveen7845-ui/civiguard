from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import re

app = FastAPI(
    title="CivicGuard AI Service",
    description="NLP microservice for automated case categorization, severity assessment & priority routing.",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ComplaintInput(BaseModel):
    description: str
    title: Optional[str] = ""

class ClassificationOutput(BaseModel):
    category: str
    priority: str
    confidence: float
    recommended_action: str
    detected_keywords: List[str]

# Expanded NLP Knowledge Base
CATEGORIES = {
    "Theft": [
        "steal", "stolen", "robber", "thief", "burglary", "wallet", "phone taken", 
        "rob", "looting", "pickpocket", "shoplifting", "break-in", "snatched", "vehicle theft"
    ],
    "Assault": [
        "hit", "punch", "attack", "fight", "assault", "beat", "weapon", "knife", 
        "violence", "physical abuse", "strangle", "threatened", "stab", "injured", "battered"
    ],
    "Vandalism": [
        "graffiti", "smash", "break", "damage", "property", "window", "defaced", 
        "broken glass", "destroyed", "trashed", "vandalized", "spray paint"
    ],
    "Fraud": [
        "scam", "fake", "money", "bank", "credit card", "fraud", "deceive", 
        "phishing", "identity theft", "ponzi", "impersonation", "extortion", "crypto scam"
    ],
    "Cybercrime": [
        "hacked", "ransomware", "account compromised", "data leak", "malware", 
        "doxxing", "cyberbullying", "darknet", "ddos"
    ],
    "Harassment": [
        "stalking", "harass", "threat", "blackmail", "abuse", "disturbing", 
        "following me", "intimidation", "verbal abuse"
    ],
    "Traffic & Road Safety": [
        "hit and run", "rash driving", "accident", "drunk driving", "speeding", 
        "traffic violation", "road rage", "illegal parking"
    ],
    "Public Disturbance": [
        "noise", "riot", "illegal gathering", "nuisance", "brawl", "public drinking", 
        "unruly crowd", "fireworks"
    ]
}

HIGH_RISK_WORDS = [
    "gun", "knife", "blood", "kill", "murder", "emergency", "weapon", "shooting", 
    "critical", "fatal", "hostage", "bomb", "explosion", "life-threatening", "unconscious", 
    "severe bleeding", "armed"
]

MEDIUM_RISK_WORDS = [
    "fight", "stolen", "injury", "threat", "danger", "robbed", "assault", "break-in", 
    "hurt", "damage", "extortion", "suspicious", "chased", "stalker"
]

def classify_text(text: str):
    text_lower = text.lower()
    scores = {cat: 0 for cat in CATEGORIES}
    matched_keywords = []
    
    for category, keywords in CATEGORIES.items():
        for kw in keywords:
            if kw in text_lower:
                scores[category] += 1
                if kw not in matched_keywords:
                    matched_keywords.append(kw)
                    
    best_match = max(scores, key=scores.get)
    if scores[best_match] > 0:
        # Compute confidence based on match strength
        confidence = min(0.98, 0.70 + (scores[best_match] * 0.08))
        return best_match, round(confidence, 2), matched_keywords
    return "Other", 0.65, matched_keywords

def assess_risk(text: str):
    text_lower = text.lower()
    
    high_matches = [w for w in HIGH_RISK_WORDS if w in text_lower]
    if high_matches:
        return "High", "Dispatch nearest patrol unit immediately (Level 1 Alert)."
    
    med_matches = [w for w in MEDIUM_RISK_WORDS if w in text_lower]
    if med_matches:
        return "Medium", "Assign investigation officer within 4 hours (Level 2 Alert)."
    
    return "Low", "Standard queue assignment for non-urgent review (Level 3 Standard)."

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "CivicGuard AI Microservice",
        "version": "2.0.0",
        "endpoints": ["/analyze", "/health"]
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "CivicGuard NLP Engine"}

@app.post("/analyze", response_model=ClassificationOutput)
async def analyze_complaint(complaint: ComplaintInput):
    full_text = f"{complaint.title} {complaint.description}".strip()
    if not full_text:
        raise HTTPException(status_code=400, detail="Description is required")
        
    category, confidence, keywords = classify_text(full_text)
    priority, action = assess_risk(full_text)
    
    return ClassificationOutput(
        category=category,
        priority=priority,
        confidence=confidence,
        recommended_action=action,
        detected_keywords=keywords[:6]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
