import About from '../../components/LPComponent/About'
import Banner from '../../components/LPComponent/Banner'
import Benefit from '../../components/LPComponent/Benefit'
import CTA from '../../components/LPComponent/CTA'
import Feature from '../../components/LPComponent/Feature'
import Footer from '../../components/LPComponent/Footer'
import Navbar from '../../components/LPComponent/Navbar'

const LPHomepage = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <About />
      <Feature />
      <Benefit/> 
      <CTA />
      <Footer />

    </div>
  )
}

export default LPHomepage
