import { Cloud, CloudFog, Compass, Droplets, Sun, Wind } from 'lucide-react'

export function WeatherWidget() {
  const weather = {
    temp: 17,
    feels_like: 15,
    humidity: 86,
    wind_speed: '9 km/h',
    cloud_cover: '35%',
    hunt_probability: 88, // 88% chance of cloud hunting
    condition: 'Sương sớm & Nắng nhẹ',
    sunrise: '05:38',
    sunset: '17:42',
    tip: 'Sáng sớm se lạnh ~15°C, độ ẩm cao. Rất lý tưởng săn mây tại Đồi chè Cầu Đất & Đồi Đa Phú từ 05:15 - 06:30!',
  }

  return (
    <div className="weather-widget-card">
      <div className="weather-head">
        <div className="weather-location">
          <CloudFog size={20} className="weather-icon-primary" />
          <div>
            <h4>Thời tiết &amp; Tỷ lệ Săn mây Đà Lạt</h4>
            <p>Dự báo hôm nay · Cao nguyên Lâm Viên</p>
          </div>
        </div>

        <div className="weather-temp-badge">
          <strong>{weather.temp}°C</strong>
          <small>{weather.condition}</small>
        </div>
      </div>

      <div className="cloud-hunting-meter">
        <div className="meter-info">
          <span className="meter-label">
            <Compass size={14} /> Xác suất săn mây thành công:
          </span>
          <span className="meter-score">{weather.hunt_probability}% · Rất lý tưởng</span>
        </div>
        <div className="meter-track">
          <div
            className="meter-bar"
            style={{ width: `${weather.hunt_probability}%` }}
            aria-valuenow={weather.hunt_probability}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <div className="weather-stats-grid">
        <div className="weather-stat-item">
          <Droplets size={14} />
          <span>Độ ẩm: <b>{weather.humidity}%</b></span>
        </div>
        <div className="weather-stat-item">
          <Wind size={14} />
          <span>Gió: <b>{weather.wind_speed}</b></span>
        </div>
        <div className="weather-stat-item">
          <Cloud size={14} />
          <span>Mây: <b>{weather.cloud_cover}</b></span>
        </div>
        <div className="weather-stat-item">
          <Sun size={14} />
          <span>Bình minh: <b>{weather.sunrise}</b></span>
        </div>
      </div>

      <p className="weather-travel-tip">💡 <b>Gợi ý du khách:</b> {weather.tip}</p>
    </div>
  )
}
