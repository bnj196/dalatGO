from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import admin, auth, bookings, departures, tours
from app.core.config import settings
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.services.seed import seed_admin, seed_demo_data

# Import models before create_all so SQLAlchemy registers every table.
from app import models  # noqa: F401,E402

app = FastAPI(title=settings.app_name, version="0.1.0", description="DALAT Go tour management HTTP API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin = seed_admin(db)
        seed_demo_data(db, admin)
    finally:
        db.close()


@app.get("/", tags=["system"])
def root():
    return {"service": settings.app_name, "status": "ok", "docs": "/docs", "health": "/health"}


@app.get("/health", tags=["system"])
def health():
    return {"status": "ok", "service": settings.app_name}


app.include_router(auth.router, prefix="/api/v1")
app.include_router(tours.router, prefix="/api/v1")
app.include_router(departures.router, prefix="/api/v1")
app.include_router(bookings.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
