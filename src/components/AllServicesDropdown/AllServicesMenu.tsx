import React, { Fragment } from 'react';
import { Backdrop } from '@patternfly/react-core';
import { Button } from '@patternfly/react-core';
import { Card, CardBody, CardHeader } from '@patternfly/react-core';
import { Stack, StackItem } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { Panel, PanelMain } from '@patternfly/react-core';
import { Sidebar, SidebarContent, SidebarPanel } from '@patternfly/react-core';
import { TabContent } from '@patternfly/react-core';
import { Content, ContentVariants } from '@patternfly/react-core';
import { Title } from '@patternfly/react-core';

import ChromeLink from '../ChromeLink';
import TimesIcon from '@patternfly/react-icons/dist/dynamic/icons/times-icon';
import type { AllServicesSection } from '../AllServices/allServicesLinks';
import FavoriteServicesGallery from '../FavoriteServices/ServicesGallery';
import AllServicesTabs from './AllServicesTabs';
import AllServicesGallery from './AllServicesGallery';
import { ServiceTileProps } from '../FavoriteServices/ServiceTile';
import QuickAccess from '../FavoriteServices/QuickAccess';
import { AllServicesDropdownContext } from './common';

export type AllServicesMenuProps = {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement>;
  linkSections: AllServicesSection[];
  favoritedServices: ServiceTileProps[];
};

const TAB_CONTENT_ID = 'refTab1Section';
const FAVORITE_TAB_ID = 'favorites';

const AllServicesMenu = ({ setIsOpen, isOpen, menuRef, linkSections, favoritedServices }: AllServicesMenuProps) => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(FAVORITE_TAB_ID);
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const [selectedService, setSelectedService] = React.useState<AllServicesSection>(linkSections[0]);

  // Toggle currently active tab
  const handleTabClick = (event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  const handleClickOutside = (event: React.MouseEvent<any>) => {
    if (isOpen && panelRef.current && !panelRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const onTabClick = (section: AllServicesSection, index: number) => {
    setSelectedService(section);
    setActiveTabKey(index);
    setIsExpanded(false);
  };

  const onToggle = (_e: React.MouseEvent<any>, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const tabContentRef = React.createRef<HTMLElement>();

  const panelRef = React.useRef<HTMLDivElement>(null);

  return (
    <AllServicesDropdownContext.Provider
      value={{
        onLinkClick() {
          // close modal on any link click
          setIsOpen(false);
        },
      }}
    >
      <div
        ref={menuRef}
        className="pf-v6-u-w-100 chr-c-page__services-nav-dropdown-menu"
        data-testid="chr-c__find-app-service"
        onClick={handleClickOutside}
      >
        <Backdrop>
          <Panel variant="raised" className="pf-v6-u-p-0 chr-c-panel-services-nav" ref={panelRef}>
            <PanelMain>
              <Sidebar>
                <SidebarPanel>
                  <Stack>
                    <StackItem className="chr-l-stack__item-browse-all-services pf-v6-u-w-100 pf-v6-u-p-md">
                      <Content className="pf-v6-u-text-align-center-on-md pf-v6-u-pl-sm pf-v6-u-pl-0-on-md">
                        <Content component={ContentVariants.p}>
                          <ChromeLink href="/allservices">
                            <Button isBlock>All services</Button>
                          </ChromeLink>
                        </Content>
                      </Content>
                    </StackItem>
                    <StackItem className="pf-v6-u-w-100">
                      <AllServicesTabs
                        activeTabKey={activeTabKey}
                        handleTabClick={handleTabClick}
                        isExpanded={isExpanded}
                        onToggle={onToggle}
                        linkSections={linkSections}
                        tabContentRef={tabContentRef}
                        onTabClick={onTabClick}
                        activeTabTitle={activeTabKey === FAVORITE_TAB_ID ? 'Favorites' : selectedService.title}
                      />
                    </StackItem>
                  </Stack>
                </SidebarPanel>
                <SidebarContent>
                  <Card isPlain>
                    <CardHeader
                      actions={{
                        actions: [
                          <Button icon={<TimesIcon />} key="close" variant="plain" aria-label="Close menu" onClick={() => setIsOpen(!isOpen)}></Button>,
                        ],
                      }}
                      className="pf-v6-u-pr-xs pf-v6-u-pr-md-on-md"
                    >
                      <Title headingLevel="h2">{activeTabKey === FAVORITE_TAB_ID ? 'Favorites' : selectedService.title}</Title>
                    </CardHeader>
                    <CardBody>
                      <TabContent eventKey={activeTabKey} id={TAB_CONTENT_ID} ref={tabContentRef} aria-label={selectedService?.description}>
                        {activeTabKey === FAVORITE_TAB_ID ? (
                          <Fragment>
                            <QuickAccess />
                            <FavoriteServicesGallery favoritedServices={favoritedServices} />
                          </Fragment>
                        ) : (
                          <AllServicesGallery selectedService={selectedService} />
                        )}
                      </TabContent>
                    </CardBody>
                  </Card>
                </SidebarContent>
              </Sidebar>
            </PanelMain>
          </Panel>
        </Backdrop>
      </div>
    </AllServicesDropdownContext.Provider>
  );
};

export default AllServicesMenu;
