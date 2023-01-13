const Popup = () => {
  return(
    <div className="flex justify-center items-center h-2">
      <div
        className="rounded-2xl border border-blue-100 p-8"
      >

        <div className="items-center sm:flex m-auto">
          <textarea
            rows={5}
            cols={100} />
        </div>
      </div>
    </div>
  )
}

export default Popup