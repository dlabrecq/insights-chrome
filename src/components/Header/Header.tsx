import React, { Fragment, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import Tools from './Tools';
import UnAuthtedHeader from './UnAuthtedHeader';
import { MastheadLogo, MastheadContent, MastheadMain, MastheadBrand, MastheadToggle } from '@patternfly/react-core';
import { Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import MastheadMenuToggle from '../Header/MastheadMenuToggle';
import SatelliteLink from './SatelliteLink';
import ContextSwitcher from '../ContextSwitcher';
import Feedback from '../Feedback';
import Activation from '../Activation';
import Logo from './Logo';
import ChromeLink from '../ChromeLink';
import { Route, Routes, useLocation } from 'react-router-dom';
import { DeepRequired } from 'utility-types';

import './Header.scss';
import { activationRequestURLs } from '../../utils/consts';
import { ITLess } from '../../utils/common';
import SearchInput from '../Search/SearchInput';
import AllServicesDropdown from '../AllServicesDropdown/AllServicesDropdown';
import Breadcrumbs, { Breadcrumbsprops } from '../Breadcrumbs/Breadcrumbs';
import useWindowWidth from '../../hooks/useWindowWidth';
import ChromeAuthContext, { ChromeAuthContextValue } from '../../auth/ChromeAuthContext';

const FeedbackRoute = () => {
  const paths =
    localStorage.getItem('chrome:experimental:feedback') === 'true'
      ? ['*']
      : ['/', 'insights/*', 'settings/*', 'openshift/*', 'application-services/*', 'ansible/*', 'edge/*', 'subscriptions/*'];
  return (
    <Routes>
      {paths.map((path) => (
        <Route key={path} path={path} element={<Feedback />} />
      ))}
    </Routes>
  );
};

export const Header = ({ breadcrumbsProps }: { breadcrumbsProps?: Breadcrumbsprops }) => {
  const { user } = useContext(ChromeAuthContext) as DeepRequired<ChromeAuthContextValue>;
  const search = new URLSearchParams(window.location.search).keys().next().value;
  const isActivationPath = activationRequestURLs.includes(search);
  const isITLessEnv = ITLess();
  const { pathname } = useLocation();
  const noBreadcrumb = !['/', '/allservices', '/favoritedservices'].includes(pathname);
  const { md, lg } = useWindowWidth();
  const [searchOpen, setSearchOpen] = useState(false);
  const hideAllServices = (isOpen: boolean) => {
    setSearchOpen(isOpen);
  };

  const { hideNav, isNavOpen, setIsNavOpen } = breadcrumbsProps as Breadcrumbsprops;

  return (
    <Fragment>
      <MastheadMain className="pf-v6-u-pt-0 pf-v6-u-pb-xs">
        {!hideNav && (
          <MastheadToggle>
            <MastheadMenuToggle setIsNavOpen={setIsNavOpen} isNavOpen={isNavOpen} />
          </MastheadToggle>
        )}
        <MastheadBrand data-codemods>
          <MastheadLogo
            data-codemods
            className="pf-v6-u-flex-shrink-0 pf-v6-u-mr-lg"
            component={(props) => <ChromeLink {...props} appId="landing" href="/" />}
          >
            <Logo />
          </MastheadLogo>
        </MastheadBrand>
        <Toolbar isFullHeight>
          <ToolbarContent>
            <ToolbarGroup className="pf-v5-m-icon-button-group pf-v6-u-ml-auto" widget-type="InsightsToolbar" visibility={{ '2xl': 'hidden' }}>
              {!lg && <HeaderTools />}
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadMain>
      <MastheadContent className="pf-v6-u-mx-md pf-v6-u-mx-0-on-2xl">
        {user?.identity?.org_id && !isITLessEnv && ReactDOM.createPortal(<FeedbackRoute />, document.body)}
        {user && isActivationPath && <Activation user={user} request={search} />}
        <Toolbar isFullHeight>
          <ToolbarContent>
            <ToolbarGroup variant="filter-group">
              {user && (
                <ToolbarItem>
                  {!(!md && searchOpen) && <AllServicesDropdown />}
                  {isITLessEnv && user?.identity?.user?.is_org_admin && <SatelliteLink />}
                </ToolbarItem>
              )}
              {user && !isITLessEnv && (
                <ToolbarItem className="pf-v5-m-hidden pf-v5-m-visible-on-xl">
                  <ContextSwitcher user={user} className="data-hj-suppress sentry-mask" />
                </ToolbarItem>
              )}
            </ToolbarGroup>
            <ToolbarGroup className="pf-v6-u-flex-grow-1 pf-v6-u-mr-0 pf-v6-u-mr-md-on-2xl" variant="filter-group">
              <SearchInput onStateChange={hideAllServices} />
            </ToolbarGroup>
            <ToolbarGroup
              className="pf-v5-m-icon-button-group pf-v6-u-ml-auto"
              visibility={{ default: 'hidden', '2xl': 'visible' }}
              widget-type="InsightsToolbar"
              // variant="action-group-plain"
              gap={{default: "gapNone"}}
            >
              {lg && <HeaderTools />}
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
      {noBreadcrumb && (
        <ToolbarGroup className="chr-c-breadcrumbs__group">
          <Breadcrumbs {...breadcrumbsProps} />
        </ToolbarGroup>
      )}
    </Fragment>
  );
};

export const HeaderTools = () => {
  const { ready } = useContext(ChromeAuthContext);
  if (!ready) {
    return <UnAuthtedHeader />;
  }
  return <Tools />;
};
