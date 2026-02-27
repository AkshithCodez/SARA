"""
SARA Setup Script
Run this to generate data and train the model.
"""

from data_generator import generate_synthetic_data
from model import train_model, save_model

def setup():
    print("=== SARA Backend Setup ===\n")
    
    # Step 1: Generate synthetic data
    print("Step 1: Generating synthetic data...")
    df = generate_synthetic_data(days=30)
    df.to_csv('data.csv', index=False)
    print(f"✓ Generated {len(df)} records\n")
    
    # Step 2: Train model
    print("Step 2: Training model...")
    model = train_model('data.csv')
    save_model(model, 'model.pkl')
    print("✓ Model trained and saved\n")
    
    print("=== Setup Complete ===")
    print("\nTo start the API server, run:")
    print("  python main.py")
    print("\nOr with uvicorn:")
    print("  uvicorn main:app --reload")

if __name__ == '__main__':
    setup()
