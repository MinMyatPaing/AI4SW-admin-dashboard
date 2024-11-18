const SwitchButton = ({ isOn, firstLabel, secondLabel, onChange }) => {
  return (
    <div className="flex items-center">
      <button
        className={`px-4 py-2 rounded-l-md transition-colors ${
          isOn
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        onClick={onChange}
      >
        {firstLabel}
      </button>
      <button
        className={`px-4 py-2 rounded-r-md transition-colors ${
          !isOn
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        onClick={onChange}
      >
        {secondLabel}
      </button>
    </div>
  );
};

export default SwitchButton;
