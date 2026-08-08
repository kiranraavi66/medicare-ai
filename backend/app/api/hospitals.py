import math
from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.schemas import HospitalInfo

router = APIRouter(prefix="/hospitals", tags=["Hospital & Emergency Locator"])

SAMPLE_HOSPITALS = [
    {
        "id": "hosp-1",
        "name": "City General Hospital & Level-1 Trauma Center",
        "type": "24/7 Multi-Specialty Trauma & Emergency",
        "address": "104 Healthcare Boulevard, Medical District",
        "phone": "+1 (800) 555-0199",
        "lat": 0.012,
        "lng": 0.009,
        "open_24_7": True
    },
    {
        "id": "hosp-2",
        "name": "St. Jude Children & Family Cardiac Institute",
        "type": "Specialized Pediatrics & Cardiac Emergency",
        "address": "45 Parkview Avenue, Westside Medical Zone",
        "phone": "+1 (800) 555-0244",
        "lat": -0.015,
        "lng": 0.018,
        "open_24_7": True
    },
    {
        "id": "hosp-3",
        "name": "Apollo Super Specialty Emergency & ICU Care",
        "type": "Super Specialty Emergency & Critical Care",
        "address": "12 Metro Bypass, North Healthcare Expressway",
        "phone": "+1 (800) 555-0911",
        "lat": 0.022,
        "lng": -0.012,
        "open_24_7": True
    },
    {
        "id": "hosp-4",
        "name": "Metro Urgent Care Clinic & Diagnostic Lab",
        "type": "Urgent Care & Family Clinic",
        "address": "88 Central Square Plaza, Suite 4",
        "phone": "+1 (800) 555-0333",
        "lat": -0.006,
        "lng": -0.007,
        "open_24_7": False
    },
    {
        "id": "hosp-5",
        "name": "Sunrise Orthopedic & Surgical Trauma Hospital",
        "type": "Orthopedic & Joint Trauma Center",
        "address": "205 East Ridge Avenue, Medical Sector 9",
        "phone": "+1 (800) 555-0777",
        "lat": 0.018,
        "lng": 0.025,
        "open_24_7": True
    },
    {
        "id": "hosp-6",
        "name": "24/7 LifeCare Emergency Pharmacy & Triage Unit",
        "type": "Emergency Pharmacy & First Aid Center",
        "address": "15 Green Valley Mall Road",
        "phone": "+1 (800) 555-0444",
        "lat": -0.021,
        "lng": -0.014,
        "open_24_7": True
    }
]

def calculate_distance(lat1, lon1, lat2, lon2):
    """Haversine distance formula in KM."""
    R = 6371.0 # Earth radius in KM
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

@router.get("/nearby", response_model=List[HospitalInfo])
def get_nearby_hospitals(
    latitude: float = Query(..., description="User latitude"),
    longitude: float = Query(..., description="User longitude"),
    radius_km: float = Query(25.0, description="Search radius in km"),
    category: Optional[str] = Query("all", description="Filter category")
):
    results = []
    for h in SAMPLE_HOSPITALS:
        target_lat = latitude + h["lat"]
        target_lng = longitude + h["lng"]
        dist = calculate_distance(latitude, longitude, target_lat, target_lng)
        
        if dist <= radius_km:
            if category == "emergency" and not h["open_24_7"]:
                continue
            
            results.append({
                "id": h["id"],
                "name": h["name"],
                "type": h["type"],
                "address": h["address"],
                "phone": h["phone"],
                "distance_km": dist,
                "latitude": target_lat,
                "longitude": target_lng,
                "open_24_7": h["open_24_7"]
            })
    
    results.sort(key=lambda x: x["distance_km"])
    return results
