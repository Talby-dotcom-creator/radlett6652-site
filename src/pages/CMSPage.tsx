// Lightweight wrapper so routes can import `CMSPage` while the heavy
// implementation lives in `CMSAdminPage.tsx`. This keeps the public route
// name stable while we iterate on the admin UI.

import React, { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

// Lazy-load the heavy admin implementation to keep the public bundle small.
const CMSAdminPage = React.lazy(() => import("./CMSAdminPage"));

const CMSPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <CMSAdminPage />
    </Suspense>
  );
};

export default CMSPage;
