import { ArrowRight, Loader2 } from "lucide-react";

const defaultClass =
  "w-full py-3 px-4 bg-[#2D2A26] hover:bg-[#1A1816] text-[#FBF9F6] rounded-xl font-medium text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer";

const Button = ({
  isLoading = false,
  loadingText = "Loading...",
  activeText = "Click Me",
  customClass = defaultClass,
  handleClick = () => {},
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={customClass}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[#FBF9F6]" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          <span>{activeText}</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
};

export default Button;
