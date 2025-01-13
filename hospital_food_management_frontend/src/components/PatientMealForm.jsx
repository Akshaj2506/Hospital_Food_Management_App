/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const PatientMealForm = ({ patient, actionType }) => {
   const [morningData, setMorningData] = useState(
      {
         mealName: "",
         patientName: patient.name || "",
         mealTiming: "Morning",
         ingredients: [],
         instructions: [],
         preparationStatus: "Pending",
         preparationStaff: "",
         deliveryStatus: "Pending",
         deliveryPersonnel: ""
      }
   );
   const [eveningData, setEveningData] = useState(
      {
         mealName: "",
         patientName: patient.name || "",
         mealTiming: "Evening",
         ingredients: [],
         instructions: [],
         preparationStatus: "Pending",
         preparationStaff: "",
         deliveryStatus: "Pending",
         deliveryPersonnel: ""
      }
   );
   const [nightData, setNightData] = useState(
      {
         mealName: "",
         patientName: patient.name || "",
         mealTiming: "Night",
         ingredients: [],
         instructions: [],
         preparationStatus: "Pending",
         preparationStaff: "",
         deliveryStatus: "Pending",
         deliveryPersonnel: ""
      }
   );
   const [action, setAction] = useState(actionType)
   const [view, setView] = useState("morning")
   const [staff, setStaff] = useState([])
   const [dietPlan, setDietPlan] = useState({
      morningMealId: "",
      eveningMealId: "",
      nightMealId: ""
   })
   useEffect(() => {
      const fetchStaff = async () => {
         await fetch("/api/auth/getAllStaff", {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "auth-token": sessionStorage.getItem("auth-token") || ""
            }
         })
            .then(res => res.json())
            .then(data => setStaff(data))
      }
      const fetchPatientMealRecord = async () => {
         await fetch(`/api/patients/fetch/${patient.id}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               "auth-token": sessionStorage.getItem("auth-token") || ""
            }
         })
            .then(res => res.json())
            .then(data => setDietPlan({
               morningMealId: data.dietPlan.morningMealId || "",
               eveningMealId: data.dietPlan.eveningMealId || "",
               nightMealId: data.dietPlan.morningMealId || ""
            }))
      }
      fetchStaff();
      if (action !== "create") fetchPatientMealRecord()
   }, [patient.id, action])

   const handleChange = (e) => {
      const { name, value } = e.target;
      if (view === "morning") {
         setMorningData({
            ...morningData,
            [name]: value,
         });
      }
      if (view === "evening") {
         setEveningData({
            ...eveningData,
            [name]: value,
         });
      }
      if (view === "night") {
         setNightData({
            ...nightData,
            [name]: value,
         });
      }
   };


   const handleArrayChange = (e, arrayKey, index) => {
      const { value } = e.target;
      if (view === "morning") {
         const updatedArray = [...morningData[arrayKey]];
         updatedArray[index] = value;
         setMorningData({
            ...morningData,
            [arrayKey]: updatedArray,
         });
      }
      if (view === "evening") {
         const updatedArray = [...eveningData[arrayKey]];
         updatedArray[index] = value;
         setEveningData({
            ...eveningData,
            [arrayKey]: updatedArray,
         });
      }
      if (view === "night") {
         const updatedArray = [...nightData[arrayKey]];
         updatedArray[index] = value;
         setNightData({
            ...nightData,
            [arrayKey]: updatedArray,
         });
      }
   };

   const addArrayItem = (arrayKey) => {
      if (view === "morning") {
         setMorningData({
            ...morningData,
            [arrayKey]: [...morningData[arrayKey], ""],
         });
      }
      if (view === "evening") {
         setEveningData({
            ...eveningData,
            [arrayKey]: [...eveningData[arrayKey], ""],
         });
      }
      if (view === "night") {
         setNightData({
            ...nightData,
            [arrayKey]: [...nightData[arrayKey], ""],
         });
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (action === "create") {
         let formData;
         if (view === "morning") formData = morningData;
         if (view === "evening") formData = eveningData;
         if (view === "night") formData = nightData;
         await fetch(`/api/meals/add`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "auth-token": sessionStorage.getItem("auth-token") || null
            },
            body: JSON.stringify(formData)
         })
            .then(res => res.json())
            .then(async(data) => {
               if (view === "morning") setDietPlan({...dietPlan, morningMealId : data.dietPlan.morningMealId});
               if (view === "evening") setDietPlan({...dietPlan, eveningMealId : data.dietPlan.eveningMealId});
               if (view === "night") setDietPlan({...dietPlan, nightMealId : data.dietPlan.nightMealId});

               await fetch(`/api/patients/assignMeal/${patient.id}`, {
                  method: "PATCH",
                  headers : {
                     "Content-Type" : "application/json",
                     "auth-token": sessionStorage.getItem("auth-token") || null
                  },
                  body : JSON.stringify(dietPlan)
               })
               // setAction("view")
            })
      }
      // if (action === "update") {
      //    await fetch(`/api/meals/update/${patient.id}`, {
      //       method: "PUT",
      //       headers: {
      //          "Content-Type": "application/json",
      //          "auth-token": sessionStorage.getItem("auth-token") || null
      //       },
      //       body: JSON.stringify(formData)
      //    })
      //       .then(res => res.json())
      //       .then(data => {
      //          setFormData({
      //             mealName: "",
      //             patientName: patient.name || "",
      //             mealTiming: "Morning",
      //             ingredients: [],
      //             instructions: [],
      //             preparationStatus: "Pending",
      //             preparationStaff: "",
      //             deliveryStatus: "Pending",
      //             deliveryPersonnel: ""
      //          })
      //          setFormData({
      //             mealName: data.mealName || "",
      //             patientName: data.patientName || "",
      //             mealTiming: data.mealTiming || "",
      //             ingredients: data.ingredients || [],
      //             instructions: data.instructions || [],
      //             preparationStatus: data.preparationStatus || "Pending",
      //             preparationStaff: data.preparationStaff || "",
      //             deliveryStatus: data.deliveryStatus || "Pending",
      //             deliveryPersonnel: data.deliveryPersonnel || ""
      //          })
      //          setAction("view")
      //       })
      // }
   };

   return (
      <>
         <div className="flex justify-end">
            {(action == "view") && <button type="button" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 me-2 mb-2 dark:focus:ring-yellow-900" onClick={() => setAction("update")}>Update</button>}
            {(action == "update") && <button type="button" className="text-white bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 mb-2 dark:bg-blue-500 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => setAction("view")}>View</button>}
         </div>


         <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 mt-2">
            <li className="me-2">
               <button className={"inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg focus:bg-blue-600 focus:text-gray-200"} onClick={() => setView("morning")}>🌄 Morning</button>
            </li>
            <li className="me-2">
               <button className={"inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg focus:bg-blue-600 focus:text-gray-200"} onClick={() => setView("evening")}>🌆 Evening</button>
            </li>
            <li className="me-2">
               <button className={"inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg focus:bg-blue-600 focus:text-gray-200"} onClick={() => { setView("night") }}>🌃 Night</button>
            </li>
         </ul>
         {(view === "morning") && <div className="max-w-4xl mx-auto p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block font-normal">Patient Name</label>
                  <input
                     type="text"
                     disabled={true}
                     name="patientName"
                     value={morningData.patientName}
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
                        required
                        value={morningData.mealName}
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
                        value={morningData.mealTiming}
                        className="w-full p-2 border rounded"
                     >
                        <option value={"Morning"}>Morning</option>
                        <option value={"Evening"}>Evening</option>
                        <option value={"Night"}>Night</option>
                     </select>
                  </div>
               </div>
               <div>
                  <label className="block font-normal">Instructions</label>
                  {morningData.instructions.length > 0 ? morningData.instructions.map((instruction, index) => (
                     <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                           type="text"
                           value={instruction}
                           disabled={!(["create", "update"].includes(action))}
                           onChange={(e) => handleArrayChange(e, "instructions", index, 0)}
                           className="w-full p-2 border rounded"
                        />
                        {(!(action === "view")) && <button
                           type="button"
                           onClick={() => addArrayItem("instructions", 0)}
                           className="p-2 bg-blue-500 text-white rounded"
                        >
                           +
                        </button>}
                     </div>
                  )) : (!(action === "view")) ? <button
                     type="button"
                     onClick={() => addArrayItem("instructions", 0)}
                     className="p-2 bg-blue-500 text-white rounded"
                  >
                     +
                  </button> : "None"}
               </div>

               <div>
                  <label className="block font-normal">Ingredients</label>
                  {morningData.ingredients.length > 0 ? morningData.ingredients.map((allergy, index) => (
                     <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                           type="text"
                           value={allergy}
                           disabled={!(["create", "update"].includes(action))}
                           onChange={(e) => handleArrayChange(e, "ingredients", index, 0)}
                           className="w-full p-2 border rounded"
                        />
                        {(!(action === "view")) && <button
                           type="button"
                           onClick={() => addArrayItem("ingredients", 0)}
                           className="p-2 bg-blue-500 text-white rounded"
                        >
                           +
                        </button>}
                     </div>
                  )) : (!(action === "view")) ? <button
                     type="button"
                     onClick={() => addArrayItem("ingredients", 0)}
                     className="p-2 bg-blue-500 text-white rounded"
                  >
                     +
                  </button> : "None"}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block font-normal">Preparation Staff</label>
                     <select name="preparationStaff" id="preparationStaff" value={morningData.preparationStaff} onChange={handleChange} className="w-full p-2 border rounded">
                        <option>Select Preparation Staff</option>
                        {staff.filter(member => member.role === "Pantry").map(member => (<option key={member._id} value={member._id}>{member.name}</option>))}
                     </select>
                  </div>
                  {(action === "view") && <div>
                     <label className="block font-normal">Preparation Status</label>
                     <select
                        name="preparationStatus"
                        disabled={true}
                        onChange={handleChange}
                        value={morningData.preparationStatus}
                        className="w-full p-2 border rounded"
                     >
                        <option value={"Pending"}>Pending</option>
                        <option value={"Preparing"}>Preparing</option>
                        <option value={"Prepared"}>Prepared</option>
                     </select>
                  </div>}
                  <div>
                     <label className="block font-normal">Delivery Personnel</label>
                     <select name="deliveryPersonnel" id="deliveryPersonnel" value={morningData.deliveryPersonnel} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="">Select Delivery Staff</option>
                        {staff.filter(member => member.role === "Delivery").map(member => (<option key={member._id} value={member._id}>{member.name}</option>))}
                     </select>
                  </div>
                  {(action === "view") && <div>
                     <label className="block font-normal">Delivery Status</label>
                     <select
                        name="deliveryStatus"
                        disabled={true}
                        onChange={handleChange}
                        value={morningData.deliveryStatus}
                        className="w-full p-2 border rounded"
                     >
                        <option value={"Pending"}>Pending</option>
                        <option value={"Preparing"}>Preparing</option>
                        <option value={"Prepared"}>Prepared</option>
                     </select>
                  </div>}
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
         </div>}
         {(view === "evening") && <div className="max-w-4xl mx-auto p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block font-normal">Patient Name</label>
                  <input
                     type="text"
                     disabled={true}
                     name="patientName"
                     value={eveningData.patientName}
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
                        value={eveningData.mealName}
                        required
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
                        value={eveningData.mealTiming}
                        className="w-full p-2 border rounded"
                     >
                        <option value={"Morning"}>Morning</option>
                        <option value={"Evening"}>Evening</option>
                        <option value={"Night"}>Night</option>
                     </select>
                  </div>
               </div>
               <div>
                  <label className="block font-normal">Instructions</label>
                  {eveningData.instructions.length > 0 ? eveningData.instructions.map((disease, index) => (
                     <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                           type="text"
                           value={disease}
                           disabled={!(["create", "update"].includes(action))}
                           onChange={(e) => handleArrayChange(e, "instructions", index, 1)}
                           className="w-full p-2 border rounded"
                        />
                        {(!(action === "view")) && <button
                           type="button"
                           onClick={() => addArrayItem("instructions", 1)}
                           className="p-2 bg-blue-500 text-white rounded"
                        >
                           +
                        </button>}
                     </div>
                  )) : (!(action === "view")) ? <button
                     type="button"
                     onClick={() => addArrayItem("instructions", 1)}
                     className="p-2 bg-blue-500 text-white rounded"
                  >
                     +
                  </button> : "None"}
               </div>

               <div>
                  <label className="block font-normal">Ingredients</label>
                  {eveningData.ingredients.length > 0 ? eveningData.ingredients.map((allergy, index) => (
                     <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                           type="text"
                           value={allergy}
                           disabled={!(["create", "update"].includes(action))}
                           onChange={(e) => handleArrayChange(e, "ingredients", index, 1)}
                           className="w-full p-2 border rounded"
                        />
                        {(!(action === "view")) && <button
                           type="button"
                           onClick={() => addArrayItem("ingredients", 1)}
                           className="p-2 bg-blue-500 text-white rounded"
                        >
                           +
                        </button>}
                     </div>
                  )) : (!(action === "view")) ? <button
                     type="button"
                     onClick={() => addArrayItem("ingredients", 1)}
                     className="p-2 bg-blue-500 text-white rounded"
                  >
                     +
                  </button> : "None"}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block font-normal">Preparation Staff</label>
                     <select name="preparationStaff" id="preparationStaff" value={eveningData.preparationStaff} onChange={handleChange} className="w-full p-2 border rounded">
                        <option>Select Preparation Staff</option>
                        {staff.filter(member => member.role === "Pantry").map(member => (<option key={member._id} value={member._id}>{member.name}</option>))}
                     </select>
                  </div>
                  {(action === "view") && <div>
                     <label className="block font-normal">Preparation Status</label>
                     <select
                        name="preparationStatus"
                        disabled={true}
                        onChange={handleChange}
                        value={eveningData.preparationStatus}
                        className="w-full p-2 border rounded"
                     >
                        <option value={"Pending"}>Pending</option>
                        <option value={"Preparing"}>Preparing</option>
                        <option value={"Prepared"}>Prepared</option>
                     </select>
                  </div>}
                  <div>
                     <label className="block font-normal">Delivery Personnel</label>
                     <select name="deliveryPersonnel" id="deliveryPersonnel" value={eveningData.deliveryPersonnel} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="">Select Delivery Staff</option>
                        {staff.filter(member => member.role === "Delivery").map(member => (<option key={member._id} value={member._id}>{member.name}</option>))}
                     </select>
                  </div>
                  {(action === "view") && <div>
                     <label className="block font-normal">Delivery Status</label>
                     <select
                        name="deliveryStatus"
                        disabled={true}
                        onChange={handleChange}
                        value={eveningData.deliveryStatus}
                        className="w-full p-2 border rounded"
                     >
                        <option value={"Pending"}>Pending</option>
                        <option value={"Preparing"}>Preparing</option>
                        <option value={"Prepared"}>Prepared</option>
                     </select>
                  </div>}
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
         </div>}
         {(view === "night") && <div className="max-w-4xl mx-auto p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block font-normal">Patient Name</label>
                  <input
                     type="text"
                     disabled={true}
                     name="patientName"
                     value={nightData.patientName}
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
                        required
                        value={nightData.mealName}
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
                        value={nightData.mealTiming}
                        className="w-full p-2 border rounded"
                     >
                        <option value={"Morning"}>Morning</option>
                        <option value={"Evening"}>Evening</option>
                        <option value={"Night"}>Night</option>
                     </select>
                  </div>
               </div>
               <div>
                  <label className="block font-normal">Instructions</label>
                  {nightData.instructions.length > 0 ? nightData.instructions.map((disease, index) => (
                     <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                           type="text"
                           value={disease}
                           disabled={!(["create", "update"].includes(action))}
                           onChange={(e) => handleArrayChange(e, "instructions", index, 2)}
                           className="w-full p-2 border rounded"
                        />
                        {(!(action === "view")) && <button
                           type="button"
                           onClick={() => addArrayItem("instructions", 2)}
                           className="p-2 bg-blue-500 text-white rounded"
                        >
                           +
                        </button>}
                     </div>
                  )) : (!(action === "view")) ? <button
                     type="button"
                     onClick={() => addArrayItem("instructions", 2)}
                     className="p-2 bg-blue-500 text-white rounded"
                  >
                     +
                  </button> : "None"}
               </div>

               <div>
                  <label className="block font-normal">Ingredients</label>
                  {nightData.ingredients.length > 0 ? nightData.ingredients.map((allergy, index) => (
                     <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                           type="text"
                           value={allergy}
                           disabled={!(["create", "update"].includes(action))}
                           onChange={(e) => handleArrayChange(e, "ingredients", index, 2)}
                           className="w-full p-2 border rounded"
                        />
                        {(!(action === "view")) && <button
                           type="button"
                           onClick={() => addArrayItem("ingredients", 2)}
                           className="p-2 bg-blue-500 text-white rounded"
                        >
                           +
                        </button>}
                     </div>
                  )) : (!(action === "view")) ? <button
                     type="button"
                     onClick={() => addArrayItem("ingredients", 2)}
                     className="p-2 bg-blue-500 text-white rounded"
                  >
                     +
                  </button> : "None"}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block font-normal">Preparation Staff</label>
                     <select name="preparationStaff" id="preparationStaff" value={nightData.preparationStaff} onChange={handleChange} className="w-full p-2 border rounded">
                        <option>Select Preparation Staff</option>
                        {staff.filter(member => member.role === "Pantry").map(member => (<option key={member._id} value={member._id}>{member.name}</option>))}
                     </select>
                  </div>
                  {(action === "view") && <div>
                     <label className="block font-normal">Preparation Status</label>
                     <select
                        name="preparationStatus"
                        disabled={true}
                        onChange={handleChange}
                        value={nightData.preparationStatus}
                        className="w-full p-2 border rounded"
                     >
                        <option value={"Pending"}>Pending</option>
                        <option value={"Preparing"}>Preparing</option>
                        <option value={"Prepared"}>Prepared</option>
                     </select>
                  </div>}
                  <div>
                     <label className="block font-normal">Delivery Personnel</label>
                     <select name="deliveryPersonnel" id="deliveryPersonnel" value={nightData.deliveryPersonnel} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="">Select Delivery Staff</option>
                        {staff.filter(member => member.role === "Delivery").map(member => (<option key={member._id} value={member._id}>{member.name}</option>))}
                     </select>
                  </div>
                  {(action === "view") && <div>
                     <label className="block font-normal">Delivery Status</label>
                     <select
                        name="deliveryStatus"
                        disabled={true}
                        onChange={handleChange}
                        value={nightData.deliveryStatus}
                        className="w-full p-2 border rounded"
                     >
                        <option value={"Pending"}>Pending</option>
                        <option value={"Preparing"}>Preparing</option>
                        <option value={"Prepared"}>Prepared</option>
                     </select>
                  </div>}
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
         </div>}
      </>
   );
}

export default PatientMealForm;
