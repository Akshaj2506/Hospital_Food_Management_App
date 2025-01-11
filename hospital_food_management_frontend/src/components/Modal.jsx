
//eslint-disable-next-line
const Modal = ({ }) => {
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
            <div className="h-max w-2/5 bg-white p-5 rounded-3xl" id="modal">
               <div id="modal-header" className="flex w-full justify-between">
                  <p className="font-bold text-2xl">Heading</p>
                  <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm py-1 px-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 float-end" onClick={() => closeModal()}>X</button>
               </div>
            </div>
         </div>
      </>
   )
}

export default Modal