export default function CooperativeSection() {
  return (
    <section id="cooperative" className="cooperative-section">
      <div className="container">
        <div className="cooperative-content">
          <h2 className="cooperative-title">Кооперативная модель связи в формате «ПЖ-19»</h2>
          <p className="cooperative-description">Сообщество равных пайщиков, объединившихся для получения доступа к свободному и быстрому интернету</p>
        </div>
        
        <div className="cooperative-mission-goals-wrapper">
          <div className="cooperative-mission">
            <div className="cooperative-mission-header">
              <h3 className="cooperative-mission-title">Миссия кооператива</h3>
            </div>
            <div className="cooperative-mission-content">
              <div className="cooperative-mission-item">
                <p className="cooperative-mission-text">
                  <strong className="mission-highlight">«ПЖ-19»</strong> — это потребительский интернет кооператив, иными словами, сообщество людей, которые объединились для совместного пользования интернетом на базе некоммерческого участия. Мы не продаём услуги — мы развиваем инфраструктуру связи вместе и для себя.
                </p>
              </div>
              <div className="cooperative-mission-item">
                <p className="cooperative-mission-text">
                  В условиях, когда коммерческие провайдеры ориентированы исключительно на прибыль, мы предлагаем иной подход — основанный на <strong>доверии</strong>, <strong>прозрачности</strong> и <strong>равноправии</strong>. Каждый участник не клиент, а полноправный пайщик, который может влиять на принятие решений и развитие кооператива.
                </p>
              </div>
              <div className="cooperative-mission-item">
                <p className="cooperative-mission-text">
                  Пайщики не оплачивают услуги, а осуществляют регулярные паевые взносы, используемые для удовлетворения потребностей по доступу к быстрому и свободному интернету, формирования паевого фонда, созданного исключительно для развития и поддержания интернет-инфраструктуры, а также иных целевых потребностей кооператива.
                </p>
              </div>
            </div>
          </div>

          <div className="cooperative-goals">
            <div className="cooperative-goals-header">
              <h3 className="cooperative-goals-title">Наши цели</h3>
            </div>
            <ul className="cooperative-goals-list">
              {[
                { icon: 'circle', text: 'Организовать коллективный доступ к свободному и быстрому интернету' },
                { icon: 'star', text: 'Укреплять кооперативные принципы — равенство, открытость, совместное участие' },
                { icon: 'layers', text: 'Обеспечить справедливую альтернативу классическим провайдерам' },
                { icon: 'users', text: 'Развивать инфраструктуру связи в интересах всех пайщиков' },
                { icon: 'target', text: 'Обеспечить прозрачность деятельности, отчетности и открытое управление' },
                { icon: 'map', text: 'Расширять доступ к цифровым технологиям даже в удалённых или малонаселённых районах' },
                { icon: 'education', text: 'Повышать цифровую грамотность членов кооператива через внутренние семинары и поддержку' }
              ].map((goal, index) => (
                <li key={index} className="cooperative-goals-item">
                  <div className="goals-item-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {goal.icon === 'circle' && (
                        <>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M2 12H22M12 2C15 6 15 18 12 22C9 18 9 6 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                        </>
                      )}
                      {goal.icon === 'star' && (
                        <>
                          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="2" fill="currentColor"/>
                        </>
                      )}
                      {goal.icon === 'layers' && (
                        <>
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </>
                      )}
                      {goal.icon === 'users' && (
                        <>
                          <path d="M4 19.5C4 18.837 4.263 18.201 4.732 17.732C5.201 17.263 5.837 17 6.5 17H17.5C18.163 17 18.799 17.263 19.268 17.732C19.737 18.201 20 18.837 20 19.5V21H4V19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 11V21M8 15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </>
                      )}
                      {goal.icon === 'target' && (
                        <>
                          <path d="M4 19.5C4 18.837 4.263 18.201 4.732 17.732C5.201 17.263 5.837 17 6.5 17H17.5C18.163 17 18.799 17.263 19.268 17.732C19.737 18.201 20 18.837 20 19.5V21H4V19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 3V7M12 11V15M12 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M3 12H7M11 12H15M19 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                        </>
                      )}
                      {goal.icon === 'map' && (
                        <>
                          <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 18L10 20L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </>
                      )}
                      {goal.icon === 'education' && (
                        <>
                          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </>
                      )}
                    </svg>
                  </div>
                  <span>{goal.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="cooperative-differences">
          <div className="cooperative-differences-header">
            <h3 className="cooperative-differences-title">Чем мы отличаемся от обычного провайдера?</h3>
          </div>
          <div className="cooperative-differences-comparison">
            <div className="comparison-column comparison-column-provider">
              <div className="comparison-column-header">
                <h4 className="comparison-title">Обычный провайдер</h4>
              </div>
              <ul className="comparison-list">
                <li className="comparison-item">
                  <span className="comparison-text">Продаёт услуги за прибыль</span>
                </li>
                <li className="comparison-item">
                  <span className="comparison-text">Ориентирован на инвесторов</span>
                </li>
                <li className="comparison-item">
                  <span className="comparison-text">Навязывает дополнительные услуги</span>
                </li>
                <li className="comparison-item">
                  <span className="comparison-text">Клиент не влияет на решения</span>
                </li>
              </ul>
            </div>
            <div className="comparison-column comparison-column-cooperative">
              <div className="comparison-column-header">
                <h4 className="comparison-title">Наш кооператив</h4>
              </div>
              <ul className="comparison-list">
                <li className="comparison-item">
                  <div className="comparison-check">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="comparison-text">Распределяем расходы между участниками</span>
                </li>
                <li className="comparison-item">
                  <div className="comparison-check">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="comparison-text">Ответственность перед пайщиками</span>
                </li>
                <li className="comparison-item">
                  <div className="comparison-check">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="comparison-text">Не навязываем дополнительные услуги</span>
                </li>
                <li className="comparison-item">
                  <div className="comparison-check">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="comparison-text">Один пайщик — один голос</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

