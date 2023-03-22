import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useDevice } from '../contexts/DeviceProvider';
import { usePanels } from '../contexts/PanelsProvider';
import { IconButton } from '../ui-components/IconButton';
import { Typography } from '../ui-components/Typography';
import { delay } from '../utils/delay';
import styles from './Sidebar.module.css';
import { SidebarItem } from './SidebarItem';

export function Sidebar(): JSX.Element {
  const [searching, setSearching] = useState(false);
  const device = useDevice();
  const history = useNavigate();
  const loc = useLocation();
  const { t, i18n } = useTranslation();

  const { setPanels } = usePanels();

  useEffect(() => {
    refreshDevice();
  }, []);

  async function refreshDevice() {
    if (searching) return;

    setSearching(true);
    await delay(1000);
    await device.refresh();
    setSearching(false);
  }

  function navigate(path: string) {
    setPanels([]);
    history(path);
  }

  return (
    <div className={styles.root}>
      <div className={styles.titlebar} />
      <div className={styles.items}>
        <SidebarItem
          primaryText={t("HOME")}
          disabled={loc.pathname === '/'}
          onClick={() => navigate(`/`)}
        />
        <Typography type="titleSmall">{t("Apps")}</Typography>
        <SidebarItem
          primaryText={t("Search")}
          disabled={loc.pathname === '/search'}
          onClick={() => navigate(`/search`)}
        />
        <SidebarItem
          primaryText={t("Categories")}
          disabled={loc.pathname === '/categories'}
          onClick={() => navigate(`/categories`)}
        />
        <Typography type="titleSmall">{t("System")}</Typography>
        <SidebarItem
          primaryText={t("Settings")}
          disabled={loc.pathname === '/settings'}
          onClick={() => navigate(`/settings`)}
        />
        <SidebarItem primaryText={t("About")} />
        <div className={styles.spacer} />
        <Typography type="titleSmall">{t("Device")}</Typography>
        {device.info ? (
          <SidebarItem
            primaryText={device.info.name}
            secondaryText={t("Connected").toString()}
            disabled={loc.pathname === '/device'}
            onClick={() => navigate(`/device`)}
          >
            <IconButton
              className={styles.btnRefresh}
              icon="refresh"
              animation="spin"
              onClick={() => refreshDevice()}
            />
          </SidebarItem>
        ) : (
          <SidebarItem primaryText={t("NoDevice")}>
            <IconButton
              className={styles.btnRefresh}
              icon="refresh"
              animation="spin"
              onClick={() => refreshDevice()}
            />
          </SidebarItem>
        )}
      </div>
    </div>
  );
}
