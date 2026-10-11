import Hero from '../../components/sections/Hero/Hero'
import ExpandMedia from '../../components/sections/ExpandMedia/ExpandMedia'
import Manifesto from '../../components/sections/Manifesto/Manifesto'
import Metodo from '../../components/sections/Metodo/Metodo'
// DISATTIVATO — i progetti escono dal sito in questa fase (route /[lang]/progetti in `_progetti`).
// import ProgettiList from '../../components/sections/ProgettiList/ProgettiList'
import Marquee from '../../components/sections/Marquee/Marquee'
import ChiSono from '../../components/sections/ChiSono/ChiSono'
import ContattiCta from '../../components/sections/ContattiCta/ContattiCta'
import ScrollTop from '../../components/ui/ScrollTop'

export default function Home() {
  return (
    <main>
      <ScrollTop />
      <Hero />
      <ExpandMedia />
      <Manifesto />
      <Metodo />
      {/* DISATTIVATO — sezione Progetti nascosta in questa fase */}
      {/* <ProgettiList /> */}
      <Marquee />
      <ChiSono />
      <ContattiCta />
    </main>
  )
}
