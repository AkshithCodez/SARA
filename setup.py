"""
SARA Setup Script
Run this to load real data and train the model.
"""

from data_loader import load_and_preprocess_dataset, get_recent_data
from model import train_model, save_model

def setup():
    print("=== SARA Backend Setup ===\n")
    
    # Step 1: Load and preprocess real dataset
    print("Step 1: Loading real dataset...")
    try:
        df = load_and_preprocess_dataset()
        
        # Use recent data for training (last 60 days for better patterns)
        df_recent = get_recent_data(df, days=60)
        
        # Save processed data
        df_recent.to_csv('data.csv', index=False)
        print(f"✓ Processed and saved {len(df_recent)} records\n")
        
    except Exception as e:
        print(f"✗ Error loading dataset: {e}")
        print("\nFalling back to synthetic data...")
        from data_generator import generate_synthetic_data
        df = generate_synthetic_data(days=30)
        df.to_csv('data.csv', index=False)
        print(f"✓ Generated {len(df)} synthetic records\n")
    
    # Step 2: Train model
    print("Step 2: Training model...")
    try:
        model = train_model('data.csv')
        save_model(model, 'model.pkl')
        print("✓ Model trained and saved\n")
    except Exception as e:
        print(f"✗ Error training model: {e}\n")
        return
    
    print("=== Setup Complete ===")
    print("\nTo start the API server, run:")
    print("  python main.py")
    print("\nOr with uvicorn:")
    print("  uvicorn main:app --reload")

if __name__ == '__main__':
    setup()
