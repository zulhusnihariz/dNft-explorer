import { Transactions } from "../types"
import classNames from "classnames"

interface TxTooltipProp {
  transaction?: Transactions,
}

const TxToolTip = (prop: TxTooltipProp) => {

  return (
    <div className="h-screen">
      <div className={classNames({
        "h-60 w-60 bg-red-600 right-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-700 bg-gray-800 p-4": true})
        }>
        <div className="flex items-center gap-4">

          <img
            alt="Developer"
            src="https://images.unsplash.com/photo-1614644147724-2d4785d69962?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80"
            className="h-16 w-16 rounded-full object-cover"
          />

          <div>
            <h3 className="text-lg font-medium text-white">Claire Mac</h3>

            <div className="flow-root">
              <ul className="-m-1 flex flex-wrap">
                <li className="p-1 leading-none">
                  <a href="#" className="text-xs font-medium text-gray-300"> Twitter </a>
                </li>

                <li className="p-1 leading-none">
                  <a href="#" className="text-xs font-medium text-gray-300"> GitHub </a>
                </li>

                <li className="p-1 leading-none">
                  <a href="#" className="text-xs font-medium text-gray-300">Website</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TxToolTip