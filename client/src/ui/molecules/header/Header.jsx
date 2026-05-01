import clsx from "clsx";
import { textColors } from "../../../styles/theme";

const Header = ({ title, description }) => {
  return (
    <div className="space-y-1 sm:space-y-1.5">
      <h2 className={clsx("text-3xl font-bold tracking-tight sm:text-4xl", textColors.primary)}>
        {title}
      </h2>
      <p className="max-w-3xl text-sm font-medium text-gray-600 sm:text-base md:text-lg">
        {description}
      </p>
    </div>
  );
};

export default Header;
