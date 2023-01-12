
const Navbar = () => {
  return (
    <header aria-label="SEED Header">
      <div className="mx-auto max-w-screen-xl overflow-y-hidden px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <a className="block text-teal-600" href="/">
              <span className="sr-only">Home</span>
              Lineage Explorer
              {/* <img src={logo} alt="" className="w-[100px] h-[32px]" /> */}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar