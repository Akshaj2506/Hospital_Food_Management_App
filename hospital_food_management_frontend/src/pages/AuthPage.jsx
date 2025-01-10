import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AuthPage = () => {
   const [login, setLogin] = useState({
      email: "",
      password: ""
   });
   const [signup, setSignup] = useState({
      name: "",
      email: "",
      password: "",
      role: "",
      location: "",
   })
   const [authType, setAuthType] = useState("login");
   const navigate = useNavigate();
   const handleChange = (e) => {
      const { name, value } = e.target;
      if (authType == "login") setLogin({ ...login, [name]: value });
      if (authType == "signup") setSignup({ ...signup, [name]: value });
   }
   const handleSubmit = async (e) => {
      e.preventDefault()
      if (authType == "login") {
         await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(login)
         })
            .then((res) => res.json())
            .then(async (data) => {
               if (data.success) {
                  sessionStorage.setItem("auth-token", data.authToken);
                  await fetch("http://localhost:5000/api/auth/getstaff", {
                     method: "POST",
                     headers: {
                        "auth-token": (sessionStorage.getItem("auth-token") ? sessionStorage.getItem("auth-token") : ""),
                        "Content-Type": "application/json"
                     }
                  })
                  .then((res) => res.json())
                  .then(data => {
                     sessionStorage.setItem("staffInfo", JSON.stringify(data));
                     navigate(`/${data.role.toLowerCase()}`)
                  })
               } else {
                  toast.error("Error: " + data.error);
               }
            })
      } else if (authType == "signup") {
         await fetch("http://localhost:5000/api/auth/create", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(signup)
         })
            .then((res) => res.json())
            .then(async (data) => {
               if (data.success) {
                  sessionStorage.setItem("auth-token", data.authToken);
                  await fetch("http://localhost:5000/api/auth/getstaff", {
                     method: "POST",
                     headers: {
                        "auth-token": (sessionStorage.getItem("auth-token") ? sessionStorage.getItem("auth-token") : ""),
                        "Content-Type": "application/json"
                     }
                  })
                     .then((res) => res.json())
                     .then(data => {
                        sessionStorage.setItem("staffInfo", JSON.stringify(data));
                        toast.success("Success: User Created Successfully")
                        navigate(`/${data.role.toLowerCase()}`)
                     })
               } else {
                  toast.error("Error: " + data.error);
               }
            })
      }

   }
   return (
      <>
         {authType == "login" && <div className="content-center min-h-screen">
            <div className="flex m-auto min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-4 bg-gray-50 rounded-lg shadow dark:border w-1/4">
               <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                  <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                     Login to your Staff account
                  </h2>
               </div>

               <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form method="POST" onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                           Email address
                        </label>
                        <div className="mt-2">
                           <input
                              id="email"
                              name="email"
                              type="email"
                              required
                              autoComplete="email"
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                              onChange={handleChange}
                           />
                        </div>
                     </div>

                     <div>
                        <div className="flex items-center justify-between">
                           <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                              Password
                           </label>
                        </div>
                        <div className="mt-2">
                           <input
                              id="password"
                              name="password"
                              type="password"
                              required
                              autoComplete="current-password"
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                              onChange={handleChange}
                           />
                        </div>
                     </div>

                     <div>
                        <button
                           type="submit"
                           className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                           Sign in
                        </button>
                        <p className="text-sm font-light text-gray-500 mt-2">Want to create an account? <button className="text-blue-400" onClick={() => { setAuthType("signup") }}>Click here</button></p>
                     </div>
                  </form>
               </div>
            </div>
         </div>}
         {authType == "signup" &&
            <section className="bg-gray-50">
               <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                  <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                     <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                           Create a Staff Account
                        </h1>
                        <form className="space-y-4 md:space-y-6" method="POST" onSubmit={handleSubmit}>
                           <div>
                              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Name</label>
                              <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="John Doe" required onChange={handleChange} />
                           </div>
                           <div>
                              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                              <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" required onChange={handleChange} />
                           </div>
                           <div>
                              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                              <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required onChange={handleChange} />
                           </div>
                           <div>
                              <label htmlFor="role" className="sr-only">Role</label>
                              <select id="role" name="role" className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer" required onChange={handleChange}>
                                 <option defaultValue={null} disabled>Choose a Role</option>
                                 <option value="Manager">Manager</option>
                                 <option value="Pantry">Pantry</option>
                                 <option value="Delivery">Delivery</option>
                              </select>
                           </div>
                           <div>
                              <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 ">Location</label>
                              <input type="text" name="location" id="location" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="A-1234, XYZ Street" required onChange={handleChange} />
                           </div>
                           <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create an account</button>
                           <p className="text-sm font-light text-gray-500">
                              Already have an account? <button className="text-blue-400" onClick={() => { setAuthType("login") }}>Click here</button>
                           </p>
                        </form>
                     </div>
                  </div>
               </div>
            </section>}

         <ToastContainer />
      </>
   )
}

export default AuthPage