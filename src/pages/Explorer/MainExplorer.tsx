
import sha256 from 'crypto-js/sha256'
import { useState } from 'react'
import Popup from './Popup'


const MainExplorer = () => {

  const [cidModalVisible, setCidModalVisible] = useState(true)

  const [search, setSearch] = useState({
    address: '',
    id: ''
  })

  const onSearchClick = (e: any) => {
    e.preventDefault()
    const result = sha256(JSON.stringify({
      token_address: search.address,
      token_id: search.id,
      chain_id: 'bnb',
      nonce: 0
    }))

    // TODO - send request to aqua

    console.log(String(result))
  }

  const onHandleChange = (event: any) => {
    setSearch({
      ...search,
      [event.target.name]: event.target.value
    })
  }

  return (
    <>
      <div className="flex w-screen items-center justify-center p-5">
        <div className="w-full rounded-lg w-3/4">
          <div className="flex">
            <input type="text"
              className="w-full bg-white pl-2 border border-blue-500 rounded-lg p-3 mr-2"
              placeholder="Token Address"
              name="address"
              value={search.address}
              onChange={onHandleChange}
            />
            <input
              type="text"
              className="w-1/2 bg-white pl-2 border border-1 rounded-lg border-blue-500 p-3 mr-2"
              placeholder="Token ID"
              name="id" 
              value={search.id}
              onChange={onHandleChange}
            />
            <input
              type="button"
              value="Search"
              className="bg-blue-500 p-2 rounded-lg text-white font-semibold hover:bg-blue-800 transition-colors"
              onClick={onSearchClick}
            />
          </div>
        </div>
      </div>
      <div className="flex w-screen items-center justify-center p-5">
        <div className="w-full relative block border border-gray-100 p-2 shadow-sm text-left">
          <div className="mt-1 mb-4 sm:flex sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600">
              Total 4 datasets
            </div>
            <div className="flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
              <input
                type="button"
                value="Add Dataset"
                className="bg-green-500 p-2 rounded-lg text-white font-semibold hover:bg-green-800 transition-colors"
              />
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200 text-sm table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th
                  className="w-1 whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
                >
                  Collection
                </th>
                <th
                  className="w-1 whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
                >
                  Key
                </th>
                <th
                  className="w-1/2 whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
                >
                  CID
                </th>
                <th
                  className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900"
                >
                  Verified
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  LOvsYSZgm5VUAgYtkcjs0w+r6OtUzJickjwppF/IoXU=
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">db5ab5f495de56b3a4eca9ac26139621ac426000861b9b6fd73715a8cb24962e</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">Qmyd..</td>
                <td className="whitespace-nowrap px-4 py-2">
                  <strong
                    className="rounded bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700"
                  >
                    Yes
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* {cidModalVisible && <Popup />} */}
    </>
  )
}

export default MainExplorer