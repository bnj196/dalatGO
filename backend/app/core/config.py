from urllib.parse import quote_plus

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "DALAT Go API"
    database_url: str = "sqlite:///./dalat_go.db"
    pg_host: str | None = None
    pg_port: int = 5432
    pg_database: str | None = None
    pg_user: str | None = None
    pg_password: str | None = None
    pg_sslmode: str = "require"
    secret_key: str = "change-this-in-production"
    access_token_expire_minutes: int = 60
    cors_origins: str = "https://dalatgo.tienthien.66ghz.com,https://dalat.huydz.42web.io,https://huydz1506.netlify.app"
    admin_email: str = "admin@dalatgo.local"
    admin_password: str = "Admin123!"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @model_validator(mode="after")
    def configure_database_url(self):
        default_sqlite_url = "sqlite:///./dalat_go.db"
        if self.database_url == default_sqlite_url and self.pg_host and self.pg_database and self.pg_user and self.pg_password:
            user = quote_plus(self.pg_user)
            password = quote_plus(self.pg_password)
            self.database_url = (
                f"postgresql+psycopg://{user}:{password}@{self.pg_host}:{self.pg_port}/"
                f"{self.pg_database}?sslmode={self.pg_sslmode}"
            )
        return self

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
