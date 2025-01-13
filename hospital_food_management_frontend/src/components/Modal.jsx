/* eslint-disable react/prop-types */

import PatientForm from "./PatientForm"
import PatientMealForm from "./PatientMealForm"

const Modal = ({ actionType }) => {
   const closeModal = () => {
      document.getElementById("modal-bg").classList.add("hidden")
      document.getElementById("modal-bg").classList.remove("block")
      document.getElementById("modal-bg-main").classList.add("hidden")
      document.getElementById("modal-bg-main").classList.remove("flex")
   }

   return (
      <>
         <div className="h-full w-full bg-black opacity-25 absolute top-0 hidden" id="modal-bg">
         </div>
         <div className="h-full w-full absolute top-0 items-center justify-center hidden" id="modal-bg-main">
            <div className="h-2/3 w-1/3 bg-white p-5 rounded-3xl" id="modal">
               <div id="modal-header" className="flex w-full justify-between pb-3 border-b-2 border-gray-300">
                  <p className="font-bold text-3xl">{actionType.split("/")[0]}</p>
                  <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm py-1 px-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 float-end" onClick={() => closeModal()}>X</button>
               </div>
               <div id="modal-body" className="h-5/6 overflow-y-scroll">
                  {actionType.split("/")[0] === "View Patient" &&
                     <PatientForm id={actionType.split("/")[1]} actionType="view" />
                  }
                  {actionType.split("/")[0] === "Create Patient" &&
                     <PatientForm id={""} actionType="create" />
                  }
                  {actionType.split("/")[0] === "Assign Meal" &&
                     <PatientMealForm 
                     patient={{
                        id : actionType.split("/")[1],
                        name : actionType.split("/")[2]
                     }}actionType="create"/>
                  }
               </div>
            </div>
         </div>
      </>
   )
}

export default Modal