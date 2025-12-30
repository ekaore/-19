import type { Metadata } from 'next'
import Script from 'next/script'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'ПЖ-19 - Интернет кооператив',
  description: 'Потребительский интернет кооператив ПЖ-19',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <Script 
          src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" 
          strategy="lazyOnload"
        />
        {children}
      </body>
    </html>
  )
}

