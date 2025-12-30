'use client'

import Link from 'next/link'

export default function TariffsSection() {
  const scrollToAddressCheck = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.querySelector('#address-check')
    if (target) {
      const headerHeight = 80
      const targetPosition = (target as HTMLElement).offsetTop - headerHeight
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="tariffs" className="tariffs-section">
      <div className="container">
        <div className="tariffs-header-wrapper">
          <div className="tariffs-title-wrapper">
            <h2 className="tariffs-title">
              <span className="title-highlight">Быстрый и стабильный</span> интернет для дома и бизнеса — <span className="title-accent">подключим уже сегодня!</span>
            </h2>
          </div>
        </div>
        <div className="tariffs-grid">
          <div className="tariff-card-new">
            <div className="tariff-left">
              <div className="tariff-left-header">ЕЖЕМЕСЯЧНАЯ ПЛАТА</div>
              <div className="tariff-left-price">
                <span className="price-main">699</span>
                <span className="price-unit">₽/мес</span>
              </div>
              <div className="tariff-left-separator"></div>
              <div className="tariff-left-features">
                <div className="tariff-feature-item">
                  <svg className="feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="feature-content">
                    <div className="feature-title">До 1000 Мбит/с</div>
                    <div className="feature-subtitle"><span className="gigabit-highlight">Гигабитная скорость</span></div>
                  </div>
                </div>
                <div className="tariff-feature-item">
                  <svg className="feature-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 8H17M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div className="feature-content">
                    <div className="feature-title">191 ТВ канал</div>
                    <div className="feature-subtitle">Включено бесплатно</div>
                  </div>
                </div>
              </div>
              <div className="tariff-left-footer">Подключение бесплатно</div>
            </div>
            <div className="tariff-right">
              <span className="tariff-best-seller">Хит продаж</span>
              <h3 className="tariff-right-title">Что входит в тариф</h3>
              <ul className="tariff-included-list">
                <li>
                  <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Скорость до 1 Гбит/с</span>
                </li>
                <li>
                  <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Цифровое ТВ 191 канал</span>
                </li>
                <li>
                  <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>До 10 устройств одновременно</span>
                </li>
                <li>
                  <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="download-speed">Скачивание 1 ГБ за <span className="speed-time">20 секунд</span></span>
                </li>
                <li>
                  <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Подключение бесплатно</span>
                </li>
              </ul>
              <div className="tariff-description">
                <p className="tariff-description-main">Стабильное подключение для всей семьи: одновременно работают до 10 устройств — ПК, ноутбуки, смартфоны, планшеты и ТВ-приставки. Файл размером 1 ГБ скачивается примерно за 20 секунд*.</p>
                <p className="tariff-description-note">* Реальная скорость зависит от вашего оборудования и условий линии.</p>
              </div>
              <div className="tariff-total">
                <div className="tariff-total-info">
                  <div className="tariff-total-label">Итого в месяц</div>
                  <div className="tariff-total-price">
                    <span className="tariff-total-amount">699</span>
                    <span className="tariff-total-currency">₽</span>
                  </div>
                </div>
                <Link href="#address-check" className="tariff-total-btn" onClick={scrollToAddressCheck}>Подключить</Link>
              </div>
            </div>
          </div>
        </div>
        <section id="additional-services" className="additional-services-section">
          <h3 className="additional-services-title">Добавьте к интернету больше возможностей</h3>
          <div className="additional-services">
            <div className="service-card">
              <div className="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 8H17M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h4 className="service-title">Цифровое телевидение</h4>
              <ul className="service-features">
                <li>
                  <svg className="service-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>До 285 каналов</span>
                </li>
                <li>
                  <svg className="service-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>От 0 ₽ в месяц</span>
                </li>
              </ul>
              <button className="service-btn">Подробнее</button>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="8" cy="10" r="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M22 7L16 10L12 7L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="service-title">Видеонаблюдение</h4>
              <ul className="service-features">
                <li>
                  <svg className="service-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Хранение до 30 дней</span>
                </li>
                <li>
                  <svg className="service-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Установка IP-видеокамер</span>
                </li>
              </ul>
              <button className="service-btn">Подробнее</button>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="service-title">Интернет в офис</h4>
              <ul className="service-features">
                <li>
                  <svg className="service-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Скорость до 1000 Мбит/с</span>
                </li>
                <li>
                  <svg className="service-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Независимое оптоволокно</span>
                </li>
                <li>
                  <svg className="service-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Приоритетная поддержка</span>
                </li>
              </ul>
              <button className="service-btn">Подробнее</button>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h4 className="service-title">Мобильная связь</h4>
              <ul className="service-features">
                <li>
                  <svg className="service-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Безлимитный интернет на смартфоне</span>
                </li>
                <li>
                  <svg className="service-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Звонки и SMS без ограничений</span>
                </li>
                <li>
                  <svg className="service-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Роуминг по РФ включён</span>
                </li>
              </ul>
              <button className="service-btn">Подробнее</button>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

