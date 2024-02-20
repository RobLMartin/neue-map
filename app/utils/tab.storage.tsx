type Tab = { value: string; label: string };

let tabs: Tab[] = [];

const fetchTabs = () => {
  const storedTabs = localStorage.getItem("datasetTabs");
  if (storedTabs) {
    tabs = JSON.parse(storedTabs);
    return tabs;
  }
  return [];
};

const addTab = (newTab: Tab) => {
  let tabs = fetchTabs();
  const tabExists = tabs.some((tab) => tab.value === newTab.value);
  if (!tabExists) {
    const updatedTabs = [...tabs, newTab];
    localStorage.setItem("datasetTabs", JSON.stringify(updatedTabs));
    tabs = updatedTabs;
  }
};

const removeTabById = (value: string) => {
  let tabs = fetchTabs();
  const updatedTabs = tabs.filter((tab) => tab.value != value);
  localStorage.setItem("datasetTabs", JSON.stringify(updatedTabs));
  tabs = updatedTabs;
};

const updateTabLabel = (value: string, newLabel: string) => {
  console.log("updateTabLabel");
  let tabs = fetchTabs();
  const updatedTabs = tabs.map((tab) => {
    if (tab.value === value) {
      console.log("updateTabLabel this label");
      return { ...tab, label: newLabel };
    }
    return tab;
  });
  localStorage.setItem("datasetTabs", JSON.stringify(updatedTabs));
  tabs = updatedTabs;
};

export { addTab, removeTabById, updateTabLabel, fetchTabs };
