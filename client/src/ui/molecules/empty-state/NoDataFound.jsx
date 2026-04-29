import images from "../../../assets";

const NoDataFound = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-52 h-52">
        <img src={images.emptyStateImage} alt="No data found" />
      </div>
      <p className="tracking-widest font-bold text-2xl text-gray-500">
        No {title} Found
      </p>
    </div>
  );
};

export default NoDataFound;
