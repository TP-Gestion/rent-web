import { useMemo, useState } from "react";
import type { Tenant } from "../types/expensas";
import { filterTenants } from "../services/expensasService";

interface TableStateParams {
  tenants: Tenant[];
  perPage: number;
}

export function useExpensasTableState({ tenants, perPage }: TableStateParams) {
  const [activeTab, setActiveTab] = useState("todos");
  const [building, setBuilding] = useState("todos");
  const [page, setPage] = useState(1);

  const filteredTenants = useMemo(
    () => filterTenants(tenants, { tab: activeTab, building }),
    [tenants, activeTab, building],
  );

  const totalResults = filteredTenants.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const visibleTenants = filteredTenants.slice(start, start + perPage);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleBuildingChange = (nextBuilding: string) => {
    setBuilding(nextBuilding);
    setPage(1);
  };

  return {
    activeTab,
    building,
    currentPage,
    filteredTenants,
    handleBuildingChange,
    handleTabChange,
    page,
    perPage,
    setPage,
    totalPages,
    totalResults,
    visibleTenants,
  };
}
