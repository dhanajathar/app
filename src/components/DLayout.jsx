import { DEventService, DEvents } from "../services/DEventService";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

import DHeader from "./DHeader";
import DSidebar from "./DSidebar";
import { DStorageService } from "../services/DStorageService";
import { loginRoutingPrefix } from "../routing/constants";

export function DLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname.includes(loginRoutingPrefix);

  const updateRoute = (e) => {
    const storage = new DStorageService(window.localStorage);
    storage.set("DestinySearchPayload", e.detail.payload);
    navigate(e.detail.path);
  };
  useEffect(() => {
    DEventService.subscribe(DEvents.ROUTE, updateRoute);
    return () => {
      DEventService.unsubscribe(DEvents.ROUTE, updateRoute);
    };
  }, [updateRoute]);
  return (
    <>
      {isLoginPage ? (
        <div className="d-content">
          <Outlet />
        </div>
      ) : (
        <div className="d-stage">
          <DSidebar />
          <div className="d-content">
            <DHeader />
            <div className="d-body">
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
