export default function ContactSection() {
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-header">
          <h2 className="contact-title">Свяжитесь с нами</h2>
          <p className="contact-subtitle">Ответим на любые вопросы о подключении</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-cards-grid">
            <div className="contact-card contact-card-phone">
              <div className="contact-card-icon-wrapper contact-icon-phone">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="contact-card-label">Бесплатный звонок</div>
              <a href="tel:+78002225519" className="contact-card-value contact-card-phone-number">8 800 222 55 19</a>
            </div>
            
            <div className="contact-card contact-card-telegram">
              <div className="contact-card-icon-wrapper contact-icon-telegram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12L16 8L12 16L10 12L8 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="contact-card-label">Telegram</div>
              <div className="contact-card-value">@PG19CONNECTBOT</div>
            </div>
            
            <div className="contact-card contact-card-email">
              <div className="contact-card-icon-wrapper contact-icon-email">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="contact-card-label">Email</div>
              <div className="contact-card-value">a@pg19.ru</div>
            </div>
            
            <div className="contact-card contact-card-office">
              <div className="contact-card-icon-wrapper contact-icon-office">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="contact-card-label">Офис продаж</div>
              <div className="contact-card-value">г. Таганрог, ул. Большая Бульварная, 11</div>
              <div className="contact-card-hours">Пн-Пт 8:00 - 20:00</div>
            </div>
          </div>
        </div>
        
        <div className="contact-footer">
          <span className="contact-footer-label">Работаем в:</span>
          <div className="contact-cities">
            <span className="contact-city">Таганрог</span>
            <span className="contact-city">Ростов-на-Дону</span>
            <span className="contact-city">Батайск</span>
            <span className="contact-city">Неклиновский район</span>
          </div>
        </div>
      </div>
    </section>
  )
}

