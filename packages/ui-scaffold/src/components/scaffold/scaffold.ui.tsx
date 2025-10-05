import React from "react";
import { isValidElement } from "react";
import { Box, cn, Grid } from "@orderly.network/ui";
import type { ScaffoldScriptReturn } from "./scaffold.script";
import type { ScaffoldProps } from "./scaffold.widget";

const LazyMainNavWidget = React.lazy(() =>
  import("../main/mainNav.widget").then((mod) => {
    return { default: mod.MainNavWidget };
  }),
);

const LazyRestrictedInfoWidget = React.lazy(() =>
  import("../restrictedInfo").then((mod) => {
    return { default: mod.RestrictedInfoWidget };
  }),
);

const LazyAnnouncementWidget = React.lazy(() =>
  import("../announcement").then((mod) => {
    return { default: mod.AnnouncementWidget };
  }),
);

const LazyFooterWidget = React.lazy(() =>
  import("../footer").then((mod) => {
    return { default: mod.FooterWidget };
  }),
);

const LazySideNavbarWidget = React.lazy(() =>
  import("../sidebar").then((mod) => {
    return { default: mod.SideNavbarWidget };
  }),
);

export type DesktopScaffoldProps = React.PropsWithChildren<
  ScaffoldProps & ScaffoldScriptReturn
>;

export const DesktopScaffold: React.FC<DesktopScaffoldProps> = (props) => {
  const {
    classNames,
    footerHeight,
    topNavbarRef,
    mainNavProps,
    topBar,
    announcementRef,
    restrictedInfo,
    hasLeftSidebar,
    expand,
    leftSideProps,
    leftSidebar,
    footer,
    footerRef,
    sideBarCollaspedWidth,
    sideBarExpandWidth,
    footerProps,
    children,
  } = props;
  return (
    <div
      style={{
        height: `calc(100vh - ${footerHeight}px)`,
      }}
      className={cn(
        "oui-scaffold-root oui-font-semibold",
        // default text and background color
        "oui-bg-base-10 oui-text-base-contrast",
        "oui-flex oui-flex-col",
        "oui-custom-scrollbar oui-overflow-auto",
        classNames?.root,
      )}
    >
      {/* topNavbar */}
      <Box
        ref={topNavbarRef}
        className={cn(
          "oui-scaffold-topNavbar oui-bg-base-9",
          classNames?.topNavbar,
        )}
      >
        {topBar ?? (
          <React.Suspense fallback={null}>
            <LazyMainNavWidget {...mainNavProps} />
          </React.Suspense>
        )}
      </Box>
      <div
        className={cn(
          "oui-scaffold-container",
          "oui-relative oui-h-full",
          // 1024px - 6px (scrollbar widt) = 1018px
          "oui-min-w-[1018px]",
          classNames?.container,
        )}
      >
        <Box px={2} ref={announcementRef}>
          <React.Suspense fallback={null}>
            <LazyRestrictedInfoWidget
              className={cn(
                "oui-scaffold-restricted-info",
                "oui-relative oui-z-[1]",
                "oui-mt-2",
                "oui-bg-base-9",
                "oui-min-w-[994px]",
              )}
            />
          </React.Suspense>
          <React.Suspense fallback={null}>
            <LazyAnnouncementWidget
              className={"oui-mx-auto oui-mt-2"}
              hideTips={restrictedInfo?.restrictedOpen}
            />
          </React.Suspense>
        </Box>
        {/*--------- body start ------ */}
        {!hasLeftSidebar ? (
          // ----------No leftSidebar layout start ---------
          <Box height="100%" className={cn(classNames?.content)}>
            {children}
          </Box>
        ) : (
          // ----------No leftSidebar layout end ---------
          // ---------- left & body layout start ---------
          <Grid
            className={cn(
              "oui-box-content oui-flex oui-transition-all xl:oui-grid",
              "oui-min-h-full oui-flex-1",
              classNames?.body,
            )}
            style={{
              gridTemplateColumns: `${
                expand
                  ? `${sideBarExpandWidth}px`
                  : `${sideBarCollaspedWidth}px`
              } 1fr`,
              // gridTemplateRows: "auto 1fr",
              // gridTemplateAreas: `"left main" "left main"`,
            }}
          >
            <div className={cn(classNames?.leftSidebar)}>
              {isValidElement<any>(leftSidebar) ? (
                leftSidebar
              ) : (
                <React.Suspense fallback={null}>
                  <LazySideNavbarWidget {...leftSideProps} />
                </React.Suspense>
              )}
            </div>
            <Box
              width={"100%"}
              className={cn("oui-overflow-hidden", classNames?.content)}
            >
              {children}
            </Box>
          </Grid>
          // ---------- left & body layout end ---------
        )}
      </div>

      {/* footer */}
      <Box
        ref={footerRef}
        className={cn(
          "oui-scaffold-footer oui-w-full oui-bg-base-10",
          "oui-fixed oui-bottom-0 oui-z-50",
          "oui-border-t oui-border-line-12",
          classNames?.footer,
        )}
      >
        {footer || (
          <React.Suspense fallback={null}>
            <LazyFooterWidget {...footerProps} />
          </React.Suspense>
        )}
      </Box>
    </div>
  );
};
