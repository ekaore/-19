import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TariffsSection from '@/components/TariffsSection'
import AddressCheckSection from '@/components/AddressCheckSection'
import CooperativeSection from '@/components/CooperativeSection'
import ContactSection from '@/components/ContactSection'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <TariffsSection />
        <AddressCheckSection />
        <CooperativeSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}

