import os
import sys
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.main import app

class TestMediCareAIFeatures(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.test_email = f"testuser_{os.urandom(4).hex()}@medicare.ai"
        self.test_password = "password123"

    def test_01_health_check(self):
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "online")

    def test_02_user_registration_and_login(self):
        # Register new user
        reg_res = self.client.post("/api/v1/auth/register", json={
            "email": self.test_email,
            "full_name": "Test Patient",
            "password": self.test_password
        })
        self.assertEqual(reg_res.status_code, 200)
        self.assertEqual(reg_res.json()["email"], self.test_email)

        # Duplicate email error check
        dup_res = self.client.post("/api/v1/auth/register", json={
            "email": self.test_email,
            "full_name": "Test Patient 2",
            "password": self.test_password
        })
        self.assertEqual(dup_res.status_code, 400)
        self.assertIn("Email is already registered", dup_res.json()["detail"])

        # Login
        login_res = self.client.post("/api/v1/auth/login", data={
            "username": self.test_email,
            "password": self.test_password
        })
        self.assertEqual(login_res.status_code, 200)
        token = login_res.json()["access_token"]
        self.assertIsNotNone(token)

    def test_03_symptom_triage_checker(self):
        # High Risk Chest Pain Test
        chest_res = self.client.post("/api/v1/symptoms/check", json={
            "age": 45,
            "gender": "Male",
            "symptoms": ["Chest Pain / Pressure", "Shortness of Breath"],
            "duration": "Less than 24 hours",
            "severity": "Severe"
        })
        self.assertEqual(chest_res.status_code, 200)
        data = chest_res.json()
        self.assertEqual(data["risk_level"], "High")
        self.assertIn("Acute Coronary Syndrome", data["possible_conditions"][0])
        self.assertIsNotNone(data["specialist_recommendation"])

        # Mild Cold Test
        cold_res = self.client.post("/api/v1/symptoms/check", json={
            "age": 25,
            "gender": "Female",
            "symptoms": ["Cough / Throat Irritation"],
            "duration": "1-3 days",
            "severity": "Mild"
        })
        self.assertEqual(cold_res.status_code, 200)
        self.assertEqual(cold_res.json()["risk_level"], "Low")

    def test_04_medicine_directory(self):
        # Search all medicines
        res = self.client.get("/api/v1/medicines/")
        self.assertEqual(res.status_code, 200)
        meds = res.json()
        self.assertGreaterEqual(len(meds), 6)

        # Search specific term
        search_res = self.client.get("/api/v1/medicines/?q=Paracetamol")
        self.assertEqual(search_res.status_code, 200)
        self.assertGreaterEqual(len(search_res.json()), 1)

    def test_05_hospital_locator(self):
        # Geolocation search
        res = self.client.get("/api/v1/hospitals/nearby?latitude=28.6139&longitude=77.2090&radius_km=25")
        self.assertEqual(res.status_code, 200)
        hospitals = res.json()
        self.assertGreaterEqual(len(hospitals), 1)

    def test_06_authenticated_chat_reminders_reports(self):
        # Login to get bearer token
        login_res = self.client.post("/api/v1/auth/login", data={
            "username": "admin@medicare.ai",
            "password": "adminpassword123"
        })
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Chat send
        chat_res = self.client.post("/api/v1/chat/send", json={"message": "First aid for minor burns"}, headers=headers)
        self.assertEqual(chat_res.status_code, 200)
        self.assertIn("burn", chat_res.json()["content"].lower())


        # 2. Chat history
        hist_res = self.client.get("/api/v1/chat/history", headers=headers)
        self.assertEqual(hist_res.status_code, 200)
        self.assertGreaterEqual(len(hist_res.json()), 1)

        # 3. Create Reminder
        rem_res = self.client.post("/api/v1/reminders/", json={
            "medicine_name": "Amoxicillin",
            "dosage": "500mg",
            "time_of_day": "09:00 AM",
            "frequency": "Daily",
            "notes": "Take after breakfast"
        }, headers=headers)
        self.assertEqual(rem_res.status_code, 200)
        rem_id = rem_res.json()["id"]

        # 4. Toggle Reminder
        tog_res = self.client.put(f"/api/v1/reminders/{rem_id}/toggle", headers=headers)
        self.assertEqual(tog_res.status_code, 200)

        # 5. Delete Reminder
        del_res = self.client.delete(f"/api/v1/reminders/{rem_id}", headers=headers)
        self.assertEqual(del_res.status_code, 200)

        # 6. Admin stats
        admin_res = self.client.get("/api/v1/admin/stats", headers=headers)
        self.assertEqual(admin_res.status_code, 200)
        self.assertIn("Operational", admin_res.json()["system_status"])


if __name__ == "__main__":
    unittest.main()
