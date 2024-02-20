type Option = { value: number; label: string };

let options: Option[] = [];

const fetchOptions = () => {
  const storedOptions = localStorage.getItem("datasetOptions");
  if (storedOptions) {
    options = JSON.parse(storedOptions);
    return options;
  }
  return [];
};

const addOption = (newOption: Option) => {
  fetchOptions(); // Refresh options before adding new one
  const updatedOptions = [...options, newOption];
  localStorage.setItem("datasetOptions", JSON.stringify(updatedOptions));
  options = updatedOptions; // Update local options
};

const removeOption = (value: number) => {
  fetchOptions();
  const updatedOptions = options.filter((option) => option.value != value);
  localStorage.setItem("datasetOptions", JSON.stringify(updatedOptions));
  options = updatedOptions;
};

export { addOption, removeOption, options, fetchOptions };
