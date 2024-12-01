from app.db.session import engine
from app.models.session import Base, UserSession
from sqlalchemy.orm import Session

def test_connection():
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        
        # Test connection by creating a session
        with Session(engine) as session:
            # Try a simple query
            result = session.query(UserSession).first()
            print("Database connection successful!")
            print(f"Found {result.id if result else 'no'} records")
            
    except Exception as e:
        print(f"Error connecting to database: {str(e)}")

if __name__ == "__main__":
    test_connection()
