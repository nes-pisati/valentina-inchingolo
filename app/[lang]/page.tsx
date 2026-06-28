import Hero from '../../components/sections/Hero/Hero'
import ExpandMedia from '../../components/sections/ExpandMedia/ExpandMedia'
import Manifesto from '../../components/sections/Manifesto/Manifesto'
import Metodo from '../../components/sections/Metodo/Metodo'
import ProgettiList from '../../components/sections/ProgettiList/ProgettiList'
import Marquee from '../../components/sections/Marquee/Marquee'
import ChiSono from '../../components/sections/ChiSono/ChiSono'
import ContattiCta from '../../components/sections/ContattiCta/ContattiCta'

export default function Home() {
  return (
    <main>
      <Hero />
      <ExpandMedia />
      <Manifesto />
      <Metodo />
      <ProgettiList />
      <Marquee />
      <ChiSono />
      <ContattiCta />
    </main>
  )
}
