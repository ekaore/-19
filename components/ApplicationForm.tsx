'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ApplicationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    phone: '',
    email: '',
    address: '',
    connectionDate: ''
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    const addressParam = searchParams.get('address')
    if (addressParam) {
      setFormData(prev => ({ ...prev, address: decodeURIComponent(addressParam) }))
    }
  }, [searchParams])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Данные заявки:', formData)
    setShowSuccessModal(true)
    
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }

  const handleChange = (field: string, value: string) => {
    if (field === 'phone') {
      setFormData(prev => ({ ...prev, [field]: formatPhone(value) }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <section className="application-page">
        <div className="application-container">
          <Link href="/" className="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Вернуться на главную
          </Link>
          
          <div className="application-header">
            <h1 className="application-title">Оставить заявку на подключение</h1>
            <p className="application-subtitle">Заполните форму, и мы свяжемся с вами в ближайшее время для уточнения деталей подключения</p>
          </div>
          
          <form className="application-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">
                  Фамилия <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-input"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">
                  Имя <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-input"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="middleName">Отчество</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  className="form-input"
                  value={formData.middleName}
                  onChange={(e) => handleChange('middleName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Телефон <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="example@mail.ru"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="address">
                Адрес подключения <span className="required">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-input"
                placeholder="Город, улица, дом, квартира"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Тариф</label>
                <div className="tariff-display">
                  <div className="tariff-display-content">
                    <div className="tariff-display-price">
                      <span className="tariff-price-main">699</span>
                      <span className="tariff-price-unit">₽/мес</span>
                    </div>
                    <div className="tariff-display-speed">
                      <svg className="tariff-speed-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>До 1000 Мбит/с</span>
                    </div>
                  </div>
                </div>
                <input type="hidden" id="tariff" name="tariff" value="699" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="connectionDate">Желаемая дата подключения</label>
                <input
                  type="date"
                  id="connectionDate"
                  name="connectionDate"
                  className="form-input"
                  value={formData.connectionDate}
                  onChange={(e) => handleChange('connectionDate', e.target.value)}
                  min={today}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="comments">Дополнительные комментарии</label>
              <textarea
                id="comments"
                name="comments"
                className="form-textarea"
                placeholder="Укажите любую дополнительную информацию, которая может быть полезна"
              />
            </div>
            
            <button type="submit" className="form-submit">Отправить заявку</button>
          </form>
        </div>
      </section>

      {showSuccessModal && (
        <div className="success-modal show">
          <div className="success-modal-overlay"></div>
          <div className="success-modal-content">
            <div className="success-modal-icon">✓</div>
            <h2 className="success-modal-title">Заявка успешно отправлена!</h2>
            <p className="success-modal-text">
              Спасибо за вашу заявку. Мы свяжемся с вами в ближайшее время для уточнения деталей подключения.
            </p>
            <p className="success-modal-redirect">Вы будете перенаправлены на главную страницу...</p>
          </div>
        </div>
      )}
    </>
  )
}

