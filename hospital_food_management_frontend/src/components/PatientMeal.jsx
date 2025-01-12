/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const PatientMealForm = ({ patient, actionType }) => {
   const [formData, setFormData] = useState({
      mealName: "",
      patientName: patient.name || "",
      mealTiming: "Morning",
      ingredients: [],
      instructions: [],
      preparationStatus: "Pending",
      preparationStaff: "",
      deliveryStatus: "Pending",
      deliveryPersonnel: ""
   });
   const [action, setAction] = useState(actionType)
   useEffect(() => {

   }, [])

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
         ...formData,
         [name]: value,
      });
   };


   const handleArrayChange = (e, arrayKey, index) => {
      const { value } = e.target;
      const updatedArray = [...formData[arrayKey]];
      updatedArray[index] = value;
      setFormData({
         ...formData,
         [arrayKey]: updatedArray,
      });
   };

   const addArrayItem = (arrayKey) => {
      setFormData({
         ...formData,
         [arrayKey]: [...formData[arrayKey], ""],
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (action === "create") {
         await fetch(`/api/meals/add`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "auth-token": sessionStorage.getItem("auth-token") || null
            },
            body: JSON.stringify(formData)
         })
            .then(res => res.json())
            .then(() => {
               setAction("view")
            })
      }
      if (action === "update") {
         await fetch(`/api/meals/update/${patient.id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               "auth-token": sessionStorage.getItem("auth-token") || null
            },
            body: JSON.stringify(formData)
         })
            .then(res => res.json())
            .then(data => {
               setFormData({
                  mealName: "",
                  patientName: patient.name || "",
                  mealTiming: "Morning",
                  ingredients: [],
                  instructions: [],
                  preparationStatus: "Pending",
                  preparationStaff: "",
                  deliveryStatus: "Pending",
                  deliveryPersonnel: ""
               })
               setFormData({
                  mealName: data.mealName || "",
                  patientName: data.patientName || "",
                  mealTiming: data.mealTiming || "",
                  ingredients: data.ingredients || [],
                  instructions: data.instructions || [],
                  preparationStatus: data.preparationStatus || "Pending",
                  preparationStaff: data.preparationStaff || "",
                  deliveryStatus: data.deliveryStatus || "Pending",
                  deliveryPersonnel: data.deliveryPersonnel || ""
               })
               setAction("view")
            })
      }
   };

   return (
      <>
         <div className="flex justify-end">
            {(action == "view") && <button type="button" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 me-2 mb-2 dark:focus:ring-yellow-900" onClick={() => setAction("update")}>Update</button>}
            {(action == "update") && <button type="button" className="text-white bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 mb-2 dark:bg-blue-500 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => setAction("view")}>View</button>}
         </div>
         <div className="max-w-4xl mx-auto p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
               <h1 className="text-2xl text-center font-bold"> 🌄 Morning Meal</h1>
               <div>
                  <label className="block font-normal">Patient Name</label>
                  <input
                     type="text"
                     disabled={true}
                     name="patientName"
                     value={formData.patientName}
                     onChange={handleChange}
                     className="w-full p-2 border rounded"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block font-normal">Meal Name</label>
                     <input
                        type="text"
                        disabled={!(["create", "update"].includes(action))}
                        name="mealName"
                        value={formData.mealName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                     />
                  </div>
                  <div>
                     <label className="block font-normal">Meal Timing</label>
                     <select
                        name="mealTiming"
                        disabled={true}
                        onChange={handleChange}
                        value={formData.mealTiming}
                        className="w-full p-2 border rounded"
                     >
                        <option value={"Morning"} selected>Morning</option>
                        <option value={"Evening"}>Evening</option>
                        <option value={"Night"}>Night</option>
                     </select>
                  </div>
               </div>
               <div>
                  <label className="block font-normal">Instructions</label>
                  {formData.instructions.length > 0 ? formData.instructions.map((disease, index) => (
                     <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                           type="text"
                           value={disease}
                           disabled={!(["create", "update"].includes(action))}
                           onChange={(e) => handleArrayChange(e, "instructions", index)}
                           className="w-full p-2 border rounded"
                        />
                        {(!(action === "view")) && <button
                           type="button"
                           onClick={() => addArrayItem("instructions")}
                           className="p-2 bg-blue-500 text-white rounded"
                        >
                           +
                        </button>}
                     </div>
                  )) : (!(action === "view")) ? <button
                     type="button"
                     onClick={() => addArrayItem("instructions")}
                     className="p-2 bg-blue-500 text-white rounded"
                  >
                     +
                  </button> : "None"}
               </div>

               <div>
                  <label className="block font-normal">Ingredients</label>
                  {formData.ingredients.length > 0 ? formData.ingredients.map((allergy, index) => (
                     <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                           type="text"
                           value={allergy}
                           disabled={!(["create", "update"].includes(action))}
                           onChange={(e) => handleArrayChange(e, "ingredients", index)}
                           className="w-full p-2 border rounded"
                        />
                        {(!(action === "view")) && <button
                           type="button"
                           onClick={() => addArrayItem("ingredients")}
                           className="p-2 bg-blue-500 text-white rounded"
                        >
                           +
                        </button>}
                     </div>
                  )) : (!(action === "view")) ? <button
                     type="button"
                     onClick={() => addArrayItem("ingredients")}
                     className="p-2 bg-blue-500 text-white rounded"
                  >
                     +
                  </button> : "None"}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block font-normal">Room Number</label>
                     <input
                        type="text"
                        disabled={!(["create", "update"].includes(action))}
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                     />
                  </div>
                  <div>
                     <label className="block font-normal">Bed Number</label>
                     <input
                        type="text"
                        name="bedNumber"
                        disabled={!(["create", "update"].includes(action))}
                        value={formData.bedNumber}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block font-normal">Floor Number</label>
                     <input
                        type="text"
                        disabled={!(["create", "update"].includes(action))}
                        name="floorNumber"
                        value={formData.floorNumber}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                     />
                  </div>
                  <div>
                     <label className="block font-normal">Age</label>
                     <input
                        type="number"
                        disabled={!(["create", "update"].includes(action))}
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                     />
                  </div>
               </div>

               <div>
                  <label className="block font-normal">Gender</label>
                  <select
                     name="gender"
                     disabled={!(["create", "update"].includes(action))}
                     value={formData.gender}
                     onChange={handleChange}
                     className="w-full p-2 border rounded"
                  >
                     <option value="">Select Gender</option>
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                     <option value="Others">Others</option>
                  </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block font-normal">Contact Info</label>
                     <input
                        type="text"
                        name="contactInfo"
                        disabled={!(["create", "update"].includes(action))}
                        value={formData.contactInfo}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                     />
                  </div>
               </div>
               {(action == "update") && <button
                  type="submit"
                  className="w-full p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
               >
                  Update
               </button>}
               {(action == "create") && <button
                  type="submit"
                  className="w-full focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"

               >
                  Create
               </button>}
            </form>
         </div>
      </>
   );
}

export default PatientMealForm;
