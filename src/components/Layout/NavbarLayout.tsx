import { useOutlet } from "react-router-dom"
import Navbar from "../Navbar"

const NavbarLayout = () => {

  const outlet = useOutlet()

  return (<>
    <Navbar />
    {outlet}
  </>)
}

export default NavbarLayout