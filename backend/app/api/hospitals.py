import math
from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.schemas import HospitalInfo

router = APIRouter(prefix="/hospitals", tags=["Hospital & Emergency Locator"])

# Sample Mock Hospitals for fallback geolocation
SAMPLE_HOSPITALS = [
    {
        "id": "hosp-1",
        "name": "City General Hospital & Trauma Center",
        "type": "General Hospital & Emergency",
        "address": "104 Healthcare Boulevard, City Center",
        "phone": "+1 (800) 555-0199",
        "lat": 0.015,
        "lng": 0.012,
        "open_24_7": True
    },
    {
        "id": "hosp-2",
        "name": "St. Jude Children & Family Clinic",
        "type": "Specialized Pediatrics & Clinic",
        "address": "45 Parkview Avenue, Westside",
        "phone": "+1 (800) 555-0244",
        "lat": -0.018,
        "lng": 0.022,
        "open_24_7": False
    },
    {
        "id": "hosp-3",
        "name": "Apollo Super Specialty Emergency Care",
        "type": "Super Specialty Emergency",
        "address": "12 Metro Bypass, North Medical Zone",
        "phone": "+1 (800) 555-0911",
        "lat": 0.025,
        "lng": -0.015,
        "open_24_7": True
    },
    {
        "id": "hosp-4",
        "name": "24/7 Wellness Pharmacy & Urgent Care",
        "type": "Pharmacy & Urgent Care",
        "address": "88 Central Square Plaza",
        "phone": "+1 (800) 555-0333",
        "lat": -0.005,
        "lng": -0.008,
        "open_24_7": True
    }
]

def calculate_distance(lat1, lon1, lat2, lon2):
    # Haversine distance formula in KM
    R = 6371.0 # Radius of Earth in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

@router.get("/nearby", response_model=List[HospitalInfo])
def get_nearby_hospitals(
    latitude: float = Query(..., description="User latitude"),
    longitude: float = Query(..., description="User longitude"),
    radius_km: float = Query(15.0, description="Search radius in km"),
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
