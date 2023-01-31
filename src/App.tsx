import React, { useCallback, useMemo, useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Loading } from "tdesign-react";
import { Header } from "./pages/Header";
import { firstOrderRouterList, NOT_FOUND_ROUTE_PATH } from "./router";
import { GlobalData, LoadingInfo } from "./types";

export const GlobalDataContext = React.createContext<GlobalData>({} as any);

function App() {
  const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({
    loading: false,
  });
  const routeList = useMemo(() => {
    return firstOrderRouterList.map((r) => {
      return <Route path={r.path} element={r.element} key={r.path} />;
    });
  }, []);

  const showLoading = useCallback((text?: string) => {
    setLoadingInfo({
      loading: true,
      text,
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingInfo({
      loading: false,
    });
  }, []);

  return (
    <GlobalDataContext.Provider
      value={{
        showLoading,
        hideLoading,
      }}
    >
      <HashRouter>
        <div className="layout">
          <Header />
          <div className="layout-content">
            <Routes>
              {routeList}
              <Route
                path="*"
                element={<Navigate to={NOT_FOUND_ROUTE_PATH} />}
              />
            </Routes>
          </div>
        </div>
      </HashRouter>
      <Loading
        loading={loadingInfo.loading}
        fullscreen
        preventScrollThrough={true}
        text={loadingInfo.text}
      ></Loading>
    </GlobalDataContext.Provider>
  );
}

export default App;
