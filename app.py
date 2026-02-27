import streamlit as st
import requests
import pandas as pd

# Configuration
BACKEND_URL = "http://127.0.0.1:8000/predict"

# Page config
st.set_page_config(page_title="SARA Dashboard", layout="wide")

# Title
st.title("🛫 SARA Dashboard")
st.markdown("**Smart Airport Resource Allocator** - Real-time lounge management system")
st.divider()

# Fetch data from backend
try:
    response = requests.get(BACKEND_URL, timeout=5)
    response.raise_for_status()
    data = response.json()
    
    forecast = data['forecast']
    peak_hour_index = data['peak_hour_index']
    staff_required = data['staff_required']
    food_required = data['food_required']
    
    # Generate hour labels (next 6 hours)
    hours = [f"Hour {i+1}" for i in range(6)]
    
    # ========== SECTION 1: Lounge Occupancy ==========
    st.subheader("📊 Lounge Occupancy Forecast")
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        # Line chart
        chart_df = pd.DataFrame({
            'Hour': hours,
            'Predicted Customers': forecast
        })
        st.line_chart(chart_df.set_index('Hour'), use_container_width=True)
    
    with col2:
        st.metric(
            label="Current Predicted Occupancy",
            value=f"{int(forecast[0])} customers"
        )
        st.metric(
            label="Peak Occupancy",
            value=f"{int(max(forecast))} customers"
        )
    
    st.divider()
    
    # ========== SECTION 2: Staffing for Peak Hours ==========
    st.subheader("👥 Staffing for Peak Hours")
    
    peak_hour = hours[peak_hour_index]
    peak_staff = staff_required[peak_hour_index]
    
    st.info(f"⚠️ Peak hour detected: **{peak_hour}** with **{int(forecast[peak_hour_index])} customers**")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.metric(
            label="Recommended Staff at Peak",
            value=f"{peak_staff} staff members"
        )
    
    with col2:
        # Staffing table
        staffing_df = pd.DataFrame({
            'Hour': hours,
            'Customers': [int(x) for x in forecast],
            'Staff Required': staff_required
        })
        st.dataframe(staffing_df, use_container_width=True, hide_index=True)
    
    st.divider()
    
    # ========== SECTION 3: Food Waste Reduction ==========
    st.subheader("🍽️ Food Waste Reduction")
    
    total_food = sum(food_required)
    
    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.metric(
            label="Total Food Required (Next 6 Hours)",
            value=f"{int(total_food)} units"
        )
    
    with col2:
        food_df = pd.DataFrame({
            'Hour': hours,
            'Food Units Required': [round(x, 1) for x in food_required]
        })
        st.dataframe(food_df, use_container_width=True, hide_index=True)
    
    st.success(
        "💡 **Smart Ordering:** By predicting demand accurately, SARA helps reduce food waste "
        "by ordering the right amount of supplies based on expected customer volume."
    )
    
    st.divider()
    
    # ========== SECTION 4: Customer Experience ==========
    st.subheader("✨ Customer Experience")
    
    st.write("Need assistance? Our staff is here to help!")
    
    if st.button("📞 Call Staff for Assistance", type="primary"):
        st.success("✅ Staff notified. Assistance will arrive shortly.")
    
except requests.exceptions.ConnectionError:
    st.error("❌ Cannot connect to backend. Please ensure the FastAPI server is running at http://127.0.0.1:8000")
    st.info("Run the backend with: `python main.py`")

except requests.exceptions.Timeout:
    st.error("⏱️ Backend request timed out. Please check if the server is responding.")

except Exception as e:
    st.error(f"❌ An error occurred: {str(e)}")
    st.info("Please check the backend server and try again.")
