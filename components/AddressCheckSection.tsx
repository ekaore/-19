'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    ymaps: any
  }
}

export default function AddressCheckSection() {
  const [address, setAddress] = useState('')
  const [autocompleteVisible, setAutocompleteVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isChecking, setIsChecking] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const router = useRouter()

  const addressSuggestions = [
    'Москва, Тверская ул., 1',
    'Москва, Ленинский просп., 10',
    'Москва, Кутузовский просп., 25',
    'Москва, Новокузнецкая ул., 5',
    'Москва, Арбат ул., 15'
  ]

  const filteredSuggestions = addressSuggestions.filter(addr => 
    addr.toLowerCase().includes(address.toLowerCase())
  )

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ymaps && mapRef.current) {
      window.ymaps.ready(() => {
        if (mapRef.current && !mapInstanceRef.current) {
          mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
            center: [55.7558, 37.6173],
            zoom: 12,
            controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
          })
        }
      })
    }
  }, [])

  const handleCheckAddress = async () => {
    if (!address.trim()) {
      alert('Пожалуйста, введите адрес')
      return
    }

    setIsChecking(true)
    
    // Имитация проверки
    setTimeout(() => {
      setIsChecking(false)
      const isAvailable = Math.random() > 0.3
      showResultModal(address, isAvailable)
    }, 1500)
  }

  const showResultModal = (addr: string, isAvailable: boolean) => {
    const message = isAvailable 
      ? 'На этом адресе доступно подключение. Мы можем подключить интернет по указанному адресу.'
      : 'Для данного адреса требуется дополнительная проверка возможности подключения.'
    
    if (confirm(`${message}\n\nОставить заявку?`)) {
      router.push(`/application?address=${encodeURIComponent(addr)}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedIndex < 0) {
      handleCheckAddress()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      setAddress(filteredSuggestions[selectedIndex])
      setAutocompleteVisible(false)
      setSelectedIndex(-1)
    }
  }

  return (
    <section id="address-check" className="address-check-section">
      <div className="container">
        <div className="address-check-card">
          <h3 className="address-check-title">Проверьте возможность подключения по вашему адресу</h3>
          <div className="address-check-form">
            <div className="address-check-form-row">
              <div className="address-input-wrapper">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value)
                    setAutocompleteVisible(e.target.value.length > 0 && e.target.value.toLowerCase().includes('москва'))
                    setSelectedIndex(-1)
                  }}
                  onFocus={() => {
                    if (address.length > 0 && address.toLowerCase().includes('москва')) {
                      setAutocompleteVisible(true)
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setAutocompleteVisible(false), 200)
                  }}
                  onKeyDown={handleKeyDown}
                  className="address-input"
                  placeholder="Введите город, улицу, дом"
                  autoComplete="off"
                />
                {autocompleteVisible && filteredSuggestions.length > 0 && (
                  <div className="address-autocomplete active">
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`autocomplete-item ${index === selectedIndex ? 'selected' : ''}`}
                        onClick={() => {
                          setAddress(suggestion)
                          setAutocompleteVisible(false)
                        }}
                      >
                        <div className="autocomplete-item-text">{suggestion}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn-check"
                onClick={handleCheckAddress}
                disabled={isChecking}
              >
                {isChecking ? 'Проверка...' : 'Проверить'}
              </button>
            </div>
          </div>
          <div className="address-check-map-container">
            <div ref={mapRef} className="address-check-map"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

