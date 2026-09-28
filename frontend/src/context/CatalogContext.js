import { createContext, useContext, useEffect, useState } from "react";
import { getCities, getSports } from "@/services/api";

// Shared taxonomies (cities + sports) loaded once — future source: WordPress taxonomies.
const CatalogContext = createContext({ cities: [], sports: [], loading: true });

export const CatalogProvider = ({ children }) => {
  const [state, setState] = useState({ cities: [], sports: [], loading: true });

  useEffect(() => {
    Promise.all([getCities(), getSports()])
      .then(([cities, sports]) => setState({ cities, sports, loading: false }))
      .catch(() => setState((s) => ({ ...s, loading: false })));
  }, []);

  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => useContext(CatalogContext);
