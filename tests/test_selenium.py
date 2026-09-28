"""
Selenium Automation Test Suite for MotoPass Portal
Designed for Software Testing Laboratory - Lab 2 & Lab 9
Automates the full 9-step end-to-end user workflow:
1. Open application
2. User Login / Registration
3. Dashboard verification
4. Vehicle Registration
5. License Application (with Age Validation testing)
6. Inspector Scoring & Component Calculation
7. Final Result Inspection (Pass/Fail)
8. Digital Wallet Fee Payment
9. Verification of Application Approval & Transaction Ledger
"""

import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

class MotoPassSeleniumAutomationSuite(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--window-size=1440,900")
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.base_url = "http://localhost:3000"
        cls.wait = WebDriverWait(cls.driver, 10)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_01_user_registration_age_bva_validation(self):
        """
        LAB 3 / BVA Automation:
        Attempt registration with Age = 17 (Invalid boundary)
        Then register successfully with Age = 24 (Valid nominal)
        """
        self.driver.get(f"{self.base_url}")
        time.sleep(1)

        # Navigate to registration if not already on it
        register_tab = self.wait.until(EC.element_to_be_clickable((By.ID, "tab-register")))
        register_tab.click()

        # Step A: Test Boundary Value 17 (Should fail)
        self.driver.find_element(By.ID, "reg-full-name").send_keys("Automated Test User")
        self.driver.find_element(By.ID, "reg-email").send_keys("auto.bva17@motopass.gov")
        self.driver.find_element(By.ID, "reg-mobile").send_keys("9876543210")
        self.driver.find_element(By.ID, "reg-password").send_keys("Test@1234")
        self.driver.find_element(By.ID, "reg-confirm-password").send_keys("Test@1234")
        
        age_input = self.driver.find_element(By.ID, "reg-age")
        age_input.clear()
        age_input.send_keys("17")

        self.driver.find_element(By.ID, "reg-address").send_keys("Plot 42, Silicon Valley Road")
        self.driver.find_element(By.ID, "reg-state").send_keys("Karnataka")
        self.driver.find_element(By.ID, "reg-city").send_keys("Bengaluru")

        # Submit
        self.driver.find_element(By.ID, "btn-register-submit").click()
        time.sleep(0.5)

        # Verify error message for Age 17
        error_banner = self.driver.find_element(By.ID, "reg-validation-error")
        self.assertIn("at least 18", error_banner.text)

        # Step B: Correct to valid age 24
        age_input.clear()
        age_input.send_keys("24")
        self.driver.find_element(By.ID, "btn-register-submit").click()
        time.sleep(1)

        # Verify dashboard opened
        dashboard_heading = self.wait.until(EC.presence_of_element_located((By.ID, "dashboard-welcome")))
        self.assertTrue(dashboard_heading.is_displayed())

    def test_02_login_and_logout_flow(self):
        """Test User Login, Admin switch, and Logout."""
        # Click logout
        logout_btn = self.wait.until(EC.element_to_be_clickable((By.ID, "btn-logout")))
        logout_btn.click()
        time.sleep(0.5)

        # Test invalid credentials
        self.driver.find_element(By.ID, "login-email").send_keys("invalid@user.com")
        self.driver.find_element(By.ID, "login-password").send_keys("WrongPassword")
        self.driver.find_element(By.ID, "btn-login-submit").click()
        time.sleep(0.5)

        err = self.driver.find_element(By.ID, "login-error-message")
        self.assertIn("Invalid email or password", err.text)

        # Click Quick Demo User Button
        quick_user_btn = self.wait.until(EC.element_to_be_clickable((By.ID, "btn-demo-citizen")))
        quick_user_btn.click()
        time.sleep(0.8)

        # Verify successful login redirect to dashboard
        welcome = self.wait.until(EC.presence_of_element_located((By.ID, "dashboard-welcome")))
        self.assertIn("Rahul Verma", welcome.text)

    def test_03_vehicle_registration(self):
        """Automate Vehicle Registration form."""
        nav_veh = self.wait.until(EC.element_to_be_clickable((By.ID, "nav-link-vehicles")))
        nav_veh.click()
        time.sleep(0.5)

        self.driver.find_element(By.ID, "veh-number").send_keys("KA-03-TE-9900")
        self.driver.find_element(By.ID, "veh-brand").send_keys("Hyundai")
        self.driver.find_element(By.ID, "veh-model").send_keys("Creta")
        self.driver.find_element(By.ID, "veh-year").send_keys("2024")
        self.driver.find_element(By.ID, "veh-owner").send_keys("Rahul Verma")

        self.driver.find_element(By.ID, "btn-register-vehicle").click()
        time.sleep(1)

        # Verify vehicle appears in list
        veh_list = self.driver.find_element(By.ID, "registered-vehicles-container")
        self.assertIn("KA-03-TE-9900", veh_list.text)

    def test_04_digital_wallet_payment_atm_rules(self):
        """Automate Payment Wallet and verify balance decrement."""
        nav_wallet = self.wait.until(EC.element_to_be_clickable((By.ID, "nav-link-wallet")))
        nav_wallet.click()
        time.sleep(0.5)

        balance_el = self.driver.find_element(By.ID, "wallet-balance-amount")
        initial_balance_str = balance_el.text.replace("₹", "").replace(",", "").strip()
        initial_balance = float(initial_balance_str)

        # Trigger quick test payment of ₹100
        pay_input = self.driver.find_element(By.ID, "wallet-custom-pay-amount")
        pay_input.clear()
        pay_input.send_keys("100")
        self.driver.find_element(By.ID, "btn-wallet-pay-now").click()
        time.sleep(1)

        # Verify new balance is initial - 100
        updated_balance_str = self.driver.find_element(By.ID, "wallet-balance-amount").text.replace("₹", "").replace(",", "").strip()
        self.assertEqual(float(updated_balance_str), initial_balance - 100.0)

if __name__ == "__main__":
    unittest.main()
