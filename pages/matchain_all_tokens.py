import requests
import json
import time
import os

# API base URL
BASE_URL = "https://matchscan.io/api/v2/tokens"

# Set initial parameters
params = {
    "type": "ERC-20,ERC-721,ERC-1155"
}

# Load existing data if available
if os.path.exists("tokens.json"):
    try:
        with open("tokens.json", "r") as f:
            all_tokens = json.load(f)
            print(f"🔄 Resuming from {len(all_tokens)} tokens collected.")
    except (json.JSONDecodeError, FileNotFoundError):
        print("⚠️ Corrupted JSON file. Starting fresh.")
        all_tokens = []
else:
    all_tokens = []

# Function to fetch tokens with pagination
def fetch_tokens():
    global params

    while True:
        try:
            # Send GET request
            response = requests.get(BASE_URL, params=params, timeout=10)

            # Check for successful response
            if response.status_code != 200:
                print(f"❌ Error {response.status_code}: {response.text}")
                break

            # Parse response JSON
            data = response.json()
            
            # Append new tokens
            new_tokens = data.get("items", [])
            all_tokens.extend(new_tokens)

            print(f"📊 Fetched {len(new_tokens)} new tokens, total collected: {len(all_tokens)}")

            # ✅ **Save tokens immediately after each request**
            save_tokens()

            # Check if there is a next page
            next_page = data.get("next_page_params")
            if not next_page:
                print("✅ All tokens fetched.")
                break

            # Construct correct next page parameters
            params = {
                "contract_address_hash": next_page["contract_address_hash"],
                "fiat_value": next_page["fiat_value"] if next_page["fiat_value"] is not None else "null",
                "holder_count": next_page["holder_count"],
                "is_name_null": str(next_page["is_name_null"]).lower(),
                "items_count": next_page["items_count"],
                "market_cap": next_page["market_cap"] if next_page["market_cap"] is not None else "null",
                "name": next_page["name"]
            }

            # Prevent API rate-limiting
            time.sleep(1.5)

        except requests.exceptions.RequestException as e:
            print(f"🚨 Request failed: {e}")
            break

# ✅ Function to save tokens immediately after every fetch
def save_tokens():
    try:
        with open("tokens.json", "w") as f:
            json.dump(all_tokens, f, indent=4)
        print(f"💾 Data saved: {len(all_tokens)} tokens written to `tokens.json`.")
    except Exception as e:
        print(f"⚠️ Failed to save JSON: {e}")

# Fetch all tokens
fetch_tokens()

# Final save
save_tokens()
print("🎉 All tokens saved successfully!")
