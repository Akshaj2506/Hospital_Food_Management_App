
//eslint-disable-next-line
const DashboardCard = ({ title, count, description, icon }) => (
   <div className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg">
      <div className="flex items-center space-x-4">
         <div className="text-blue-600 text-3xl">{icon}</div>
         <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-gray-600">{description}</p>
            <p className="text-xl font-semibold mt-2">{count}</p>
         </div>
      </div>
   </div>
);

export default DashboardCard;
