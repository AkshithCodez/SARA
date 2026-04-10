from core.database import verify_connection

if __name__ == "__main__":
    success = verify_connection()
    if success:
        print("Connection working ✅")
    else:
        print("Connection failed ❌")