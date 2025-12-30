'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        const headerHeight = 80
        const targetPosition = (target as HTMLElement).offsetTop - headerHeight
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link href="/">
              <Image src="/logo.png" alt="Логотип компании" className="logo-img" width={120} height={40} />
            </Link>
          </div>

          <nav className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link href="#tariffs" className="nav-link" onClick={(e) => handleNavClick(e, '#tariffs')}>
                  Тариф
                </Link>
              </li>
              <li className="nav-item">
                <Link href="#additional-services" className="nav-link" onClick={(e) => handleNavClick(e, '#additional-services')}>
                  Услуги
                </Link>
              </li>
              <li className="nav-item">
                <Link href="#address-check" className="nav-link" onClick={(e) => handleNavClick(e, '#address-check')}>
                  Подключение
                </Link>
              </li>
              <li className="nav-item">
                <Link href="#cooperative" className="nav-link" onClick={(e) => handleNavClick(e, '#cooperative')}>
                  О кооперативе
                </Link>
              </li>
              <li className="nav-item">
                <Link href="#contact" className="nav-link" onClick={(e) => handleNavClick(e, '#contact')}>
                  Контакты
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-right">
            <a href="tel:+79991234567" className="phone-link">8 800 222 55 19</a>
            <button className="btn-cabinet" onClick={() => router.push('/login')}>
              <svg className="btn-cabinet-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Личный кабинет</span>
            </button>
          </div>

          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            aria-label="Открыть меню"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}

