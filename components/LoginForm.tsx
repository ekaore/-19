'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type LoginMethod = 'phone' | 'contract' | 'telegram' | 'email'

export default function LoginForm() {
  const [activeMethod, setActiveMethod] = useState<LoginMethod>('phone')
  const [phone, setPhone] = useState('')
  const [contractNumber, setContractNumber] = useState('')
  const [contractPassword, setContractPassword] = useState('')
  const [email, setEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [smsCode, setSmsCode] = useState(['', '', '', '', '', ''])
  const [showSmsModal, setShowSmsModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')

  const formatPhone = (value: string) => {
    let cleaned = value.replace(/\D/g, '')
    if (cleaned.startsWith('8')) {
      cleaned = '7' + cleaned.substring(1)
    }
    if (cleaned.startsWith('7')) {
      cleaned = cleaned.substring(0, 11)
      let formatted = '+7'
      if (cleaned.length > 1) formatted += ' (' + cleaned.substring(1, 4)
      if (cleaned.length > 4) formatted += ') ' + cleaned.substring(4, 7)
      if (cleaned.length > 7) formatted += '-' + cleaned.substring(7, 9)
      if (cleaned.length > 9) formatted += '-' + cleaned.substring(9, 11)
      return formatted
    }
    return value
  }

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length < 10) {
      alert('Пожалуйста, введите корректный номер телефона')
      return
    }
    setShowSmsModal(true)
  }

  const handleSmsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = smsCode.join('')
    if (code.length !== 6) {
      alert('Пожалуйста, введите 6-значный код')
      return
    }
    setShowSmsModal(false)
    setConfirmMessage(`Вход в личный кабинет выполнен успешно с номера ${phone}`)
    setShowConfirmModal(true)
  }

  const handleContractSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmMessage(`Вход в личный кабинет выполнен успешно по договор №${contractNumber}`)
    setShowConfirmModal(true)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmMessage(`Вход в личный кабинет выполнен успешно с email ${email}`)
    setShowConfirmModal(true)
  }

  const handleTelegramLogin = () => {
    alert('Интеграция с Telegram ботом будет реализована позже. Для входа используйте другие методы.')
  }

  const handleSmsCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1]
    if (!/^\d*$/.test(value)) return
    
    const newCode = [...smsCode]
    newCode[index] = value
    setSmsCode(newCode)
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`sms-input-${index + 1}`)
      if (nextInput) (nextInput as HTMLInputElement).focus()
    }
  }

  const handleSmsKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !smsCode[index] && index > 0) {
      const prevInput = document.getElementById(`sms-input-${index - 1}`)
      if (prevInput) (prevInput as HTMLInputElement).focus()
    }
  }

  return (
    <>
      <section className="login-page">
        <div className="login-container">
          <Link href="/" className="login-back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Вернуться на главную
          </Link>
          
          <div className="login-wrapper">
            <div className="login-sidebar">
              <div className="login-sidebar-header">
                <div className="login-logo">
                  <Image src="/logo.png" alt="ПЖ-19" width={120} height={50} />
                </div>
                <h1 className="login-title">Вход в личный кабинет</h1>
                <p className="login-subtitle">Выберите способ входа</p>
              </div>
              
              <ul className="login-methods-list">
                <li className="login-method-item">
                  <button 
                    className={`login-method-btn ${activeMethod === 'phone' ? 'active' : ''}`}
                    onClick={() => setActiveMethod('phone')}
                  >
                    <div className="login-method-btn-content">
                      <div className="login-method-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="login-method-info">
                        <div className="login-method-name">Телефон</div>
                        <div className="login-method-hint">SMS код</div>
                      </div>
                    </div>
                  </button>
                </li>
                
                <li className="login-method-item">
                  <button 
                    className={`login-method-btn ${activeMethod === 'contract' ? 'active' : ''}`}
                    onClick={() => setActiveMethod('contract')}
                  >
                    <div className="login-method-btn-content">
                      <div className="login-method-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="login-method-info">
                        <div className="login-method-name">Договор</div>
                        <div className="login-method-hint">Номер и пароль</div>
                      </div>
                    </div>
                  </button>
                </li>
                
                <li className="login-method-item">
                  <button 
                    className={`login-method-btn ${activeMethod === 'telegram' ? 'active' : ''}`}
                    onClick={() => setActiveMethod('telegram')}
                  >
                    <div className="login-method-btn-content">
                      <div className="login-method-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 14.95 9.7 15.02 9.37C15.03 9.3 15.03 9.15 14.93 9.08C14.84 9 14.7 9.03 14.59 9.05C14.43 9.08 12.39 10.24 8.46 12.52C7.8 12.89 7.19 13.07 6.64 13.05C6.02 13.02 4.84 12.74 4.01 12.5C2.99 12.19 2.2 12.01 2.26 11.38C2.29 11.06 2.75 10.72 3.73 10.38C7.27 9.18 9.98 8.35 11.85 7.89C15.35 6.98 16.11 6.78 16.55 6.78C16.64 6.78 16.85 6.8 17 6.92C17.12 7.02 17.15 7.14 17.17 7.22C17.19 7.3 17.21 7.5 17.19 7.68L16.64 8.8Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <div className="login-method-info">
                        <div className="login-method-name">Telegram</div>
                        <div className="login-method-hint">Быстрый вход</div>
                      </div>
                    </div>
                  </button>
                </li>
                
                <li className="login-method-item">
                  <button 
                    className={`login-method-btn ${activeMethod === 'email' ? 'active' : ''}`}
                    onClick={() => setActiveMethod('email')}
                  >
                    <div className="login-method-btn-content">
                      <div className="login-method-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="login-method-info">
                        <div className="login-method-name">Email</div>
                        <div className="login-method-hint">Email и пароль</div>
                      </div>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="login-content-area">
              {activeMethod === 'phone' && (
                <div className="login-method-panel active">
                  <div className="login-method-panel-header">
                    <h2 className="login-method-panel-title">Вход по телефону</h2>
                    <p className="login-method-panel-description">Введите номер телефона для получения кода подтверждения</p>
                  </div>
                  <form onSubmit={handlePhoneSubmit}>
                    <div className="login-form-group">
                      <label className="login-form-label" htmlFor="phone-number">Номер телефона</label>
                      <input
                        type="tel"
                        id="phone-number"
                        className="login-form-input"
                        placeholder="+7 (___) ___-__-__"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        required
                      />
                    </div>
                    <button type="submit" className="login-btn">
                      <span>Получить код</span>
                    </button>
                  </form>
                  <div className="login-info">
                    <div className="login-info-item">На указанный номер будет отправлен SMS-код для входа</div>
                    <div className="login-info-item">Код действителен в течение 5 минут</div>
                  </div>
                </div>
              )}

              {activeMethod === 'contract' && (
                <div className="login-method-panel active">
                  <div className="login-method-panel-header">
                    <h2 className="login-method-panel-title">Вход по номеру договора</h2>
                    <p className="login-method-panel-description">Введите номер договора и пароль для входа</p>
                  </div>
                  <form onSubmit={handleContractSubmit}>
                    <div className="login-form-group">
                      <label className="login-form-label" htmlFor="contract-number">Номер договора</label>
                      <input
                        type="text"
                        id="contract-number"
                        className="login-form-input"
                        placeholder="Введите номер договора"
                        value={contractNumber}
                        onChange={(e) => setContractNumber(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                    </div>
                    <div className="login-form-group">
                      <label className="login-form-label" htmlFor="contract-password">Пароль</label>
                      <input
                        type="password"
                        id="contract-password"
                        className="login-form-input"
                        placeholder="Введите пароль"
                        value={contractPassword}
                        onChange={(e) => setContractPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="login-btn">
                      <span>Войти</span>
                    </button>
                  </form>
                  <div className="login-info">
                    <div className="login-info-item">Номер договора указан в договоре на оказание услуг</div>
                    <div className="login-info-item">Забыли пароль? <Link href="#contact" className="login-link">Восстановить доступ</Link></div>
                  </div>
                </div>
              )}

              {activeMethod === 'telegram' && (
                <div className="login-method-panel active">
                  <div className="login-method-panel-header">
                    <h2 className="login-method-panel-title">Войти через Telegram</h2>
                    <p className="login-method-panel-description">Нажмите кнопку для авторизации через Telegram бота</p>
                  </div>
                  <button className="login-btn" onClick={handleTelegramLogin}>
                    <span>Войти через Telegram</span>
                  </button>
                  <div className="login-info">
                    <div className="login-info-item">Ваш Telegram должен быть привязан к аккаунту</div>
                    <div className="login-info-item">Для привязки обратитесь в <Link href="#contact" className="login-link">поддержку</Link></div>
                  </div>
                </div>
              )}

              {activeMethod === 'email' && (
                <div className="login-method-panel active">
                  <div className="login-method-panel-header">
                    <h2 className="login-method-panel-title">Вход по email</h2>
                    <p className="login-method-panel-description">Введите email и пароль для входа в личный кабинет</p>
                  </div>
                  <form onSubmit={handleEmailSubmit}>
                    <div className="login-form-group">
                      <label className="login-form-label" htmlFor="email-address">Email</label>
                      <input
                        type="email"
                        id="email-address"
                        className="login-form-input"
                        placeholder="example@mail.ru"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="login-form-group">
                      <label className="login-form-label" htmlFor="email-password">Пароль</label>
                      <input
                        type="password"
                        id="email-password"
                        className="login-form-input"
                        placeholder="Введите пароль"
                        value={emailPassword}
                        onChange={(e) => setEmailPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="login-btn">
                      <span>Войти</span>
                    </button>
                  </form>
                  <div className="login-info">
                    <div className="login-info-item">Забыли пароль? <Link href="#contact" className="login-link">Восстановить доступ</Link></div>
                    <div className="login-info-item">Нет аккаунта? <Link href="/application" className="login-link">Оставить заявку на подключение</Link></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showSmsModal && (
        <div className="sms-modal active">
          <div className="sms-modal-content">
            <button className="sms-modal-close" onClick={() => setShowSmsModal(false)}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="sms-modal-header">
              <h2 className="sms-modal-title">Введите код подтверждения</h2>
              <p className="sms-modal-description">
                Мы отправили SMS с кодом на номер <span className="sms-modal-phone">{phone}</span>
              </p>
            </div>
            <form onSubmit={handleSmsSubmit}>
              <div className="sms-code-inputs">
                {smsCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`sms-input-${index}`}
                    type="text"
                    className="sms-code-input"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleSmsCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleSmsKeyDown(index, e)}
                    required
                  />
                ))}
              </div>
              <div className="sms-modal-actions">
                <button type="submit" className="sms-modal-btn">
                  <span>Подтвердить</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="confirm-modal active">
          <div className="confirm-modal-content">
            <div className="confirm-modal-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="confirm-modal-title">Вход выполнен!</h2>
            <p className="confirm-modal-message">{confirmMessage}</p>
            <button className="confirm-modal-btn" onClick={() => {
              setShowConfirmModal(false)
              alert('Добро пожаловать в личный кабинет!')
            }}>
              Продолжить
            </button>
          </div>
        </div>
      )}
    </>
  )
}

