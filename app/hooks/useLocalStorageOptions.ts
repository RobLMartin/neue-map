import { useState, useEffect, useCallback } from "react";

type Option = { value: number; label: string };

const useLocalStorageOptions = (key: string) => {
  const [options, setOptions] = useState<Option[]>([]);

  const fetchOptions = useCallback(() => {
    const storedOptions = localStorage.getItem(key);
    if (storedOptions) {
      setOptions(JSON.parse(storedOptions));
    }
  }, [key]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const addOption = (newOption: Option) => {
    const updatedOptions = [newOption, ...options];
    localStorage.setItem(key, JSON.stringify(updatedOptions));
    fetchOptions(); // Refresh options after adding
  };

  const removeOption = (value: number) => {
    const updatedOptions = options.filter((option) => option.value !== value);
    localStorage.setItem(key, JSON.stringify(updatedOptions));
    fetchOptions(); // Refresh options after removing
  };

  return { options, addOption, removeOption, refreshOptions: fetchOptions };
};
export default useLocalStorageOptions;
